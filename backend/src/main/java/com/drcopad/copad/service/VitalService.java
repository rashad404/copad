package com.drcopad.copad.service;

import com.drcopad.copad.entity.*;
import com.drcopad.copad.repository.UserRepository;
import com.drcopad.copad.repository.VitalReadingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

/**
 * Recording and interpreting vital signs.
 *
 * Conversion, plausibility and reference-range evaluation all happen on write,
 * so every consumer reads comparable numbers and a stored reading already
 * carries its own verdict.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class VitalService {

    private final VitalReadingRepository readingRepository;
    private final UserRepository userRepository;
    private final FamilyService familyService;
    private final VitalUnitConverter converter;
    private final VitalReferenceRanges referenceRanges;

    /** A direction of travel over a window, with the size of the change. */
    public record Trend(VitalType type, String direction, BigDecimal changeAbsolute,
                        BigDecimal changePercent, int readings,
                        BigDecimal first, BigDecimal last, String unit) {
    }

    @Transactional(readOnly = true)
    public List<VitalReading> recent(Long memberId, Long userId) {
        familyService.requireMemberAccess(memberId, userId, false);
        return readingRepository.findByFamilyMemberIdAndDeletedAtIsNullOrderByMeasuredAtDesc(memberId);
    }

    @Transactional(readOnly = true)
    public List<VitalReading> series(Long memberId, Long userId, VitalType type) {
        familyService.requireMemberAccess(memberId, userId, false);
        return readingRepository
                .findByFamilyMemberIdAndVitalTypeAndDeletedAtIsNullOrderByMeasuredAtAsc(memberId, type);
    }

    /** The newest reading of each type, which is what a profile header shows. */
    @Transactional(readOnly = true)
    public Map<VitalType, VitalReading> latestByType(Long memberId, Long userId) {
        familyService.requireMemberAccess(memberId, userId, false);
        Map<VitalType, VitalReading> latest = new EnumMap<>(VitalType.class);
        for (VitalType type : VitalType.values()) {
            readingRepository
                    .findFirstByFamilyMemberIdAndVitalTypeAndDeletedAtIsNullOrderByMeasuredAtDesc(memberId, type)
                    .ifPresent(reading -> latest.put(type, reading));
        }
        return latest;
    }

    @Transactional
    public VitalReading record(Long memberId, Long userId, VitalType type,
                               BigDecimal value, String unit, LocalDateTime measuredAt,
                               VitalSource source, String notes) {
        FamilyMember member = familyService.requireMemberAccess(memberId, userId, true);

        // Throws on an unknown unit or an implausible result, so nothing
        // unconvertible reaches the database.
        VitalUnitConverter.Converted converted = converter.toCanonical(type, value, unit);

        VitalReading reading = new VitalReading();
        reading.setFamilyMember(member);
        reading.setVitalType(type);
        reading.setValueCanonical(converted.value());
        reading.setUnitCanonical(converted.unit());
        reading.setValueEntered(value);
        reading.setUnitEntered(unit == null ? type.canonicalUnit() : unit);
        reading.setMeasuredAt(measuredAt == null ? LocalDateTime.now() : measuredAt);
        reading.setSource(source == null ? VitalSource.MANUAL : source);
        reading.setNotes(notes);
        reading.setAbnormalFlag(referenceRanges.evaluate(type, converted.value(), member));
        reading.setRecordedBy(userId == null ? null : userRepository.findById(userId).orElse(null));

        VitalReading saved = readingRepository.save(reading);

        // BMI is derived, never entered, so it stays consistent with the height
        // and weight it came from instead of drifting as a stale third number.
        if (type == VitalType.WEIGHT || type == VitalType.HEIGHT) {
            recalculateBmi(member, userId);
        }
        return saved;
    }

    /**
     * Public so a synced weight keeps BMI honest too.
     *
     * A scale that syncs a new weight while BMI still reflects last month's is
     * a stale third number sitting in the record looking current.
     */
    public void recalculateBmi(FamilyMember member, Long userId) {
        VitalReading weight = readingRepository
                .findFirstByFamilyMemberIdAndVitalTypeAndDeletedAtIsNullOrderByMeasuredAtDesc(
                        member.getId(), VitalType.WEIGHT).orElse(null);
        VitalReading height = readingRepository
                .findFirstByFamilyMemberIdAndVitalTypeAndDeletedAtIsNullOrderByMeasuredAtDesc(
                        member.getId(), VitalType.HEIGHT).orElse(null);
        if (weight == null || height == null) return;

        BigDecimal bmi = converter.bmi(weight.getValueCanonical(), height.getValueCanonical());
        if (bmi == null || !VitalType.BMI.isPlausible(bmi)) return;

        VitalReading reading = new VitalReading();
        reading.setFamilyMember(member);
        reading.setVitalType(VitalType.BMI);
        reading.setValueCanonical(bmi);
        reading.setUnitCanonical(VitalType.BMI.canonicalUnit());
        reading.setMeasuredAt(weight.getMeasuredAt());
        reading.setSource(VitalSource.DEVICE);
        reading.setNotes("Derived from weight and height");
        reading.setAbnormalFlag(referenceRanges.evaluate(VitalType.BMI, bmi, member));
        reading.setRecordedBy(userId == null ? null : userRepository.findById(userId).orElse(null));
        readingRepository.save(reading);
    }

    @Transactional
    public void delete(Long readingId, Long userId) {
        VitalReading reading = readingRepository.findByIdAndDeletedAtIsNull(readingId)
                .orElseThrow(() -> new IllegalArgumentException("Reading not found"));
        familyService.requireMemberAccess(reading.getFamilyMember().getId(), userId, true);
        reading.setDeletedAt(LocalDateTime.now());
        readingRepository.save(reading);
    }

    /**
     * Direction of travel per vital over a window.
     *
     * This is what turns a record into something the assistant can reason
     * about: "your systolic has risen 18 points across three readings since
     * June" is useful in a way that today's single number is not.
     *
     * First and last readings only - a regression over a handful of irregular
     * home measurements would imply a precision the data does not have.
     */
    @Transactional(readOnly = true)
    public List<Trend> trends(Long memberId, Long userId, int windowDays) {
        familyService.requireMemberAccess(memberId, userId, false);
        LocalDateTime since = LocalDateTime.now().minusDays(windowDays);

        return java.util.Arrays.stream(VitalType.values())
                .map(type -> trendFor(memberId, type, since))
                .filter(java.util.Objects::nonNull)
                .toList();
    }

    private Trend trendFor(Long memberId, VitalType type, LocalDateTime since) {
        List<VitalReading> readings = readingRepository
                .findByFamilyMemberIdAndVitalTypeAndMeasuredAtAfterAndDeletedAtIsNullOrderByMeasuredAtAsc(
                        memberId, type, since);
        // Two points are the minimum that can describe a direction.
        if (readings.size() < 2) return null;

        BigDecimal first = readings.get(0).getValueCanonical();
        BigDecimal last = readings.get(readings.size() - 1).getValueCanonical();
        BigDecimal change = last.subtract(first);

        BigDecimal percent = first.signum() == 0 ? BigDecimal.ZERO
                : change.multiply(new BigDecimal("100")).divide(first, 1, RoundingMode.HALF_UP);

        // A 2% band keeps ordinary scale-to-scale noise from reading as a trend.
        String direction = percent.abs().compareTo(new BigDecimal("2")) < 0 ? "STABLE"
                : change.signum() > 0 ? "RISING" : "FALLING";

        return new Trend(type, direction, change.stripTrailingZeros(), percent,
                readings.size(), first.stripTrailingZeros(), last.stripTrailingZeros(),
                type.canonicalUnit());
    }
}
