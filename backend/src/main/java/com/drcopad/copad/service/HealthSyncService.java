package com.drcopad.copad.service;

import com.drcopad.copad.entity.*;
import com.drcopad.copad.repository.HealthConnectionRepository;
import com.drcopad.copad.repository.VitalReadingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Readings arriving from a phone, a watch, or an exported file.
 *
 * The whole difficulty is that a device sends the same thing repeatedly - on
 * resume, on retry, after a reinstall - and sends a great deal of it. So this
 * refuses more than it accepts, and every refusal is counted and reported back
 * rather than hidden, because a sync that silently drops half a person's
 * readings is worse than one that says what it did.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class HealthSyncService {

    /**
     * How many samples one request may carry.
     *
     * A watch can produce a heart rate every few seconds. Accepting an
     * unbounded batch would let one phone fill the table, so the client is made
     * to send in pages.
     */
    public static final int MAX_BATCH = 500;

    /**
     * How close a device sample may be to something entered by hand.
     *
     * Inside this window the manual reading wins and the device one is skipped.
     * Somebody who measured their own blood pressure and typed it in meant that
     * number; a cuff syncing the same measurement should not produce a second,
     * slightly different row beside it.
     */
    private static final int MANUAL_PRECEDENCE_MINUTES = 5;

    private final VitalReadingRepository vitals;
    private final HealthConnectionRepository connections;
    private final FamilyService familyService;
    // The same collaborators the manual path uses, so a synced reading is
    // converted and judged exactly like a typed one rather than by a second
    // set of rules that can drift.
    private final VitalUnitConverter converter;
    private final VitalReferenceRanges referenceRanges;
    private final VitalService vitalService;

    /** One sample as a device reports it. */
    public record Sample(VitalType type,
                         BigDecimal value,
                         String unit,
                         LocalDateTime measuredAt,
                         String sourceRef,
                         String deviceLabel) {
    }

    /** What happened, in enough detail for the client to trust the result. */
    public record Result(int accepted,
                         int alreadyHad,
                         int skippedManual,
                         int rejected,
                         LocalDateTime syncedThrough) {
    }

    @Transactional(readOnly = true)
    public List<HealthConnection> connections(Long memberId, Long userId) {
        familyService.requireMemberAccess(memberId, userId, false);
        return connections.findByFamilyMemberIdOrderByProviderAsc(memberId);
    }

    @Transactional
    public HealthConnection connect(Long memberId, Long userId, HealthProvider provider,
                                    String deviceLabel) {
        FamilyMember member = familyService.requireMemberAccess(memberId, userId, true);
        HealthConnection connection = connections
                .findByFamilyMemberIdAndProvider(memberId, provider)
                .orElseGet(() -> {
                    HealthConnection fresh = new HealthConnection();
                    fresh.setFamilyMember(member);
                    fresh.setProvider(provider);
                    return fresh;
                });
        // Reconnecting resumes rather than starting a second stream of the same
        // readings, which is what the unique key on the connection is for.
        connection.setEnabled(true);
        if (deviceLabel != null && !deviceLabel.isBlank()) {
            connection.setDeviceLabel(deviceLabel.trim());
        }
        return connections.save(connection);
    }

    @Transactional
    public void disconnect(Long memberId, Long userId, HealthProvider provider) {
        familyService.requireMemberAccess(memberId, userId, true);
        connections.findByFamilyMemberIdAndProvider(memberId, provider)
                .ifPresent(connection -> {
                    // Switched off, not deleted, and the readings already taken
                    // stay: they are part of the record, and disconnecting a
                    // phone is not a request to erase last year's blood
                    // pressure.
                    connection.setEnabled(false);
                    connections.save(connection);
                });
    }

    /**
     * Takes a batch of samples.
     *
     * Idempotent by the id the device gives each sample: sending the same batch
     * twice accepts it once. That is what makes a phone free to resend whenever
     * it is unsure, which is often.
     */
    @Transactional
    public Result sync(Long memberId, Long userId, HealthProvider provider,
                       List<Sample> samples) {

        familyService.requireMemberAccess(memberId, userId, true);

        if (samples == null || samples.isEmpty()) {
            return new Result(0, 0, 0, 0, null);
        }
        if (samples.size() > MAX_BATCH) {
            throw new IllegalArgumentException(
                    "Send at most " + MAX_BATCH + " readings at a time");
        }

        HealthConnection connection = connections
                .findByFamilyMemberIdAndProvider(memberId, provider)
                .orElseThrow(() -> new IllegalStateException(
                        "Connect this source before syncing"));
        if (!connection.isEnabled()) {
            throw new IllegalStateException("This source is switched off");
        }

        List<String> refs = samples.stream()
                .map(Sample::sourceRef).filter(r -> r != null && !r.isBlank()).toList();
        // Identity is the record, what was measured and when. Android puts both
        // halves of a blood pressure, and an entire heart rate series, under one
        // record id; keying on the id alone called those duplicates and threw
        // all but the first away.
        // Identity is the record, what was measured and when. Android puts both
        // halves of a blood pressure, and an entire heart rate series, under one
        // record id; keying on the id alone called those duplicates and threw
        // all but the first away.
        //
        // Built in Java on both sides rather than concatenated in SQL: the
        // database renders a timestamp differently from Java, so the two
        // strings would never have matched.
        Set<String> already = new HashSet<>();
        if (!refs.isEmpty()) {
            for (VitalReading held : vitals.existingSamples(memberId, VitalSource.DEVICE, refs)) {
                already.add(identityOf(held.getSourceRef(), held.getVitalType(),
                        held.getMeasuredAt()));
            }
        }

        int accepted = 0, alreadyHad = 0, skippedManual = 0, rejected = 0;
        LocalDateTime furthest = connection.getSyncedThrough();
        List<VitalReading> batch = new ArrayList<>();

        for (Sample sample : samples) {
            if (sample.type() == null || sample.value() == null
                    || sample.measuredAt() == null || sample.sourceRef() == null
                    || sample.sourceRef().isBlank()) {
                rejected++;
                continue;
            }
            // A device clock can be wrong, and a reading from next year would
            // sit at the top of the record forever.
            if (sample.measuredAt().isAfter(LocalDateTime.now().plusHours(1))) {
                rejected++;
                continue;
            }
            String identity = identityOf(sample.sourceRef(), sample.type(),
                    sample.measuredAt());
            if (already.contains(identity)) {
                alreadyHad++;
                continue;
            }
            if (manualExistsNear(memberId, sample)) {
                skippedManual++;
                continue;
            }

            VitalReading reading = new VitalReading();
            reading.setFamilyMember(connection.getFamilyMember());
            reading.setVitalType(sample.type());
            reading.setValueEntered(sample.value());
            reading.setUnitEntered(sample.unit());
            reading.setMeasuredAt(sample.measuredAt());
            reading.setSource(VitalSource.DEVICE);
            reading.setSourceRef(sample.sourceRef());
            reading.setDeviceLabel(sample.deviceLabel() != null
                    ? sample.deviceLabel() : connection.getDeviceLabel());
            VitalUnitConverter.Converted converted =
                    converter.toCanonical(sample.type(), sample.value(), sample.unit());
            reading.setValueCanonical(converted.value());
            reading.setUnitCanonical(converted.unit());
            reading.setAbnormalFlag(referenceRanges.evaluate(
                    sample.type(), converted.value(), connection.getFamilyMember()));

            batch.add(reading);
            already.add(identity);
            accepted++;
            if (furthest == null || sample.measuredAt().isAfter(furthest)) {
                furthest = sample.measuredAt();
            }
        }

        if (!batch.isEmpty()) {
            try {
                vitals.saveAll(batch);
            } catch (DataIntegrityViolationException raced) {
                // Two phones syncing at once. The key held, which is the point;
                // the rows that lost are already in the record.
                log.info("Sync collided on the source id; the duplicates were refused");
                alreadyHad += batch.size();
                accepted = 0;
            }
        }

        // A scale syncing a new weight must not leave BMI showing last month's.
        if (accepted > 0 && batch.stream().anyMatch(r ->
                r.getVitalType() == VitalType.WEIGHT || r.getVitalType() == VitalType.HEIGHT)) {
            vitalService.recalculateBmi(connection.getFamilyMember(), userId);
        }

        connection.setSyncedThrough(furthest);
        connection.setLastSyncAt(LocalDateTime.now());
        connections.save(connection);

        // Counts only. What was measured is clinical.
        log.info("Sync for connection {}: {} accepted, {} already held, {} deferred to manual, {} rejected",
                connection.getId(), accepted, alreadyHad, skippedManual, rejected);
        return new Result(accepted, alreadyHad, skippedManual, rejected, furthest);
    }

    /**
     * What makes two device readings the same reading.
     *
     * Must match the unique key on the table and the query above, or a sample
     * skipped here would be accepted there, or the reverse.
     */
    private static String identityOf(String sourceRef, VitalType type,
                                     LocalDateTime measuredAt) {
        return sourceRef + "|" + type + "|" + measuredAt;
    }

    private boolean manualExistsNear(Long memberId, Sample sample) {
        return vitals.existsByFamilyMemberIdAndVitalTypeAndSourceAndMeasuredAtBetweenAndDeletedAtIsNull(
                memberId, sample.type(), VitalSource.MANUAL,
                sample.measuredAt().minusMinutes(MANUAL_PRECEDENCE_MINUTES),
                sample.measuredAt().plusMinutes(MANUAL_PRECEDENCE_MINUTES));
    }
}
