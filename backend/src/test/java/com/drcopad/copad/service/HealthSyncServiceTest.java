package com.drcopad.copad.service;

import com.drcopad.copad.entity.*;
import com.drcopad.copad.entity.VitalReading;
import com.drcopad.copad.repository.HealthConnectionRepository;
import com.drcopad.copad.repository.VitalReadingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class HealthSyncServiceTest {

    private VitalReadingRepository vitals;
    private HealthConnectionRepository connections;
    private FamilyService familyService;
    private HealthSyncService service;
    private FamilyMember member;

    private static final LocalDateTime WHEN = LocalDateTime.now().minusDays(1);

    @BeforeEach
    void setUp() {
        vitals = mock(VitalReadingRepository.class);
        connections = mock(HealthConnectionRepository.class);
        familyService = mock(FamilyService.class);
        VitalUnitConverter converter = mock(VitalUnitConverter.class);
        VitalReferenceRanges ranges = mock(VitalReferenceRanges.class);

        service = new HealthSyncService(vitals, connections, familyService,
                converter, ranges, mock(VitalService.class));

        member = new FamilyMember();
        member.setId(21L);
        when(familyService.requireMemberAccess(eq(21L), any(), anyBoolean())).thenReturn(member);

        HealthConnection connection = new HealthConnection();
        connection.setId(1L);
        connection.setFamilyMember(member);
        connection.setProvider(HealthProvider.APPLE_HEALTH);
        connection.setEnabled(true);
        when(connections.findByFamilyMemberIdAndProvider(21L, HealthProvider.APPLE_HEALTH))
                .thenReturn(Optional.of(connection));

        // The blood pressure and heart rate shapes below are Android's, so that
        // source has to be connected too.
        HealthConnection android = new HealthConnection();
        android.setId(2L);
        android.setFamilyMember(member);
        android.setProvider(HealthProvider.HEALTH_CONNECT);
        android.setEnabled(true);
        when(connections.findByFamilyMemberIdAndProvider(21L, HealthProvider.HEALTH_CONNECT))
                .thenReturn(Optional.of(android));

        when(converter.toCanonical(any(), any(), any()))
                .thenAnswer(i -> new VitalUnitConverter.Converted(
                        i.getArgument(1), "bpm"));
        when(vitals.existingSamples(anyLong(), any(), anyList())).thenReturn(List.of());
    }

    private HealthSyncService.Sample sample(String ref, LocalDateTime at) {
        return new HealthSyncService.Sample(VitalType.PULSE, new BigDecimal("70"),
                "bpm", at, ref, "Watch");
    }

    @Test
    void aSampleAlreadyHeldIsCountedRatherThanStoredAgain() {
        when(vitals.existingSamples(anyLong(), any(), anyList())).thenReturn(List.of(held("a1", VitalType.PULSE, WHEN)));

        HealthSyncService.Result result = service.sync(21L, 5L, HealthProvider.APPLE_HEALTH,
                List.of(sample("a1", WHEN), sample("a2", WHEN)));

        assertThat(result.alreadyHad()).isEqualTo(1);
        assertThat(result.accepted()).isEqualTo(1);
    }

    /**
     * The same batch arriving twice within one request must not be written
     * twice either - a phone that repeats a sample inside its own payload is
     * the same problem as one that resends the batch.
     */
    @Test
    void aRepeatWithinOneBatchIsTakenOnce() {
        HealthSyncService.Result result = service.sync(21L, 5L, HealthProvider.APPLE_HEALTH,
                List.of(sample("a1", WHEN), sample("a1", WHEN)));

        assertThat(result.accepted()).isEqualTo(1);
        assertThat(result.alreadyHad()).isEqualTo(1);
    }

    @Test
    void aReadingEnteredByHandIsNotDisplacedByADeviceSampleBesideIt() {
        when(vitals.existsByFamilyMemberIdAndVitalTypeAndSourceAndMeasuredAtBetweenAndDeletedAtIsNull(
                eq(21L), eq(VitalType.PULSE), eq(VitalSource.MANUAL), any(), any()))
                .thenReturn(true);

        HealthSyncService.Result result = service.sync(21L, 5L, HealthProvider.APPLE_HEALTH,
                List.of(sample("a1", WHEN)));

        assertThat(result.skippedManual()).isEqualTo(1);
        assertThat(result.accepted()).isZero();
        verify(vitals, never()).saveAll(any());
    }

    private VitalReading held(String ref, VitalType type, LocalDateTime at) {
        VitalReading row = new VitalReading();
        row.setSourceRef(ref);
        row.setVitalType(type);
        row.setMeasuredAt(at);
        return row;
    }

    private HealthSyncService.Sample typed(String ref, VitalType type, LocalDateTime at) {
        return new HealthSyncService.Sample(type, new BigDecimal("120"), "mmHg",
                at, ref, "Phone");
    }

    /**
     * Android puts both halves of a blood pressure in one record with one id.
     * Keying on the id alone stored the systolic and silently dropped the
     * diastolic, which is worse than storing neither.
     */
    @Test
    void bothHalvesOfABloodPressureShareARecordIdAndAreBothKept() {
        HealthSyncService.Result result = service.sync(21L, 5L, HealthProvider.HEALTH_CONNECT,
                List.of(typed("hc-bp-1", VitalType.BLOOD_PRESSURE_SYSTOLIC, WHEN),
                        typed("hc-bp-1", VitalType.BLOOD_PRESSURE_DIASTOLIC, WHEN)));

        assertThat(result.accepted()).isEqualTo(2);
        assertThat(result.alreadyHad()).isZero();
    }

    /** A heart rate record holds a whole series of samples under one id. */
    @Test
    void aHeartRateSeriesUnderOneRecordIdKeepsEverySample() {
        HealthSyncService.Result result = service.sync(21L, 5L, HealthProvider.HEALTH_CONNECT,
                List.of(typed("hc-hr-1", VitalType.PULSE, WHEN),
                        typed("hc-hr-1", VitalType.PULSE, WHEN.plusMinutes(1)),
                        typed("hc-hr-1", VitalType.PULSE, WHEN.plusMinutes(2))));

        assertThat(result.accepted()).isEqualTo(3);
    }

    /** Widening identity must not weaken it: the same sample twice is still one. */
    @Test
    void theSameSampleFromTheSameRecordIsStillTakenOnce() {
        HealthSyncService.Result result = service.sync(21L, 5L, HealthProvider.HEALTH_CONNECT,
                List.of(typed("hc-bp-1", VitalType.BLOOD_PRESSURE_SYSTOLIC, WHEN),
                        typed("hc-bp-1", VitalType.BLOOD_PRESSURE_SYSTOLIC, WHEN)));

        assertThat(result.accepted()).isEqualTo(1);
        assertThat(result.alreadyHad()).isEqualTo(1);
    }

    @Test
    void aSampleWithNoIdOfItsOwnIsRefused() {
        HealthSyncService.Result result = service.sync(21L, 5L, HealthProvider.APPLE_HEALTH,
                List.of(sample(null, WHEN), sample("  ", WHEN)));

        assertThat(result.rejected()).isEqualTo(2);
        assertThat(result.accepted()).isZero();
    }

    /** A device clock can be wrong, and tomorrow's reading would sit on top forever. */
    @Test
    void aReadingFromTheFutureIsRefused() {
        HealthSyncService.Result result = service.sync(21L, 5L, HealthProvider.APPLE_HEALTH,
                List.of(sample("a1", LocalDateTime.now().plusDays(2))));

        assertThat(result.rejected()).isEqualTo(1);
    }

    @Test
    void anOversizedBatchIsRefusedRatherThanPartlyTaken() {
        List<HealthSyncService.Sample> tooMany =
                java.util.stream.IntStream.range(0, HealthSyncService.MAX_BATCH + 1)
                        .mapToObj(i -> sample("s" + i, WHEN)).toList();

        assertThatThrownBy(() ->
                service.sync(21L, 5L, HealthProvider.APPLE_HEALTH, tooMany))
                .isInstanceOf(IllegalArgumentException.class);
        verify(vitals, never()).saveAll(any());
    }

    @Test
    void syncingIntoASourceThatWasSwitchedOffIsRefused() {
        HealthConnection off = new HealthConnection();
        off.setFamilyMember(member);
        off.setEnabled(false);
        when(connections.findByFamilyMemberIdAndProvider(21L, HealthProvider.HEALTH_CONNECT))
                .thenReturn(Optional.of(off));

        assertThatThrownBy(() -> service.sync(21L, 5L, HealthProvider.HEALTH_CONNECT,
                List.of(sample("a1", WHEN))))
                .isInstanceOf(IllegalStateException.class);
    }

    @Test
    void syncingBeforeConnectingIsRefused() {
        // FILE is the one source this member has not connected.
        assertThatThrownBy(() -> service.sync(21L, 5L, HealthProvider.FILE,
                List.of(sample("a1", WHEN))))
                .isInstanceOf(IllegalStateException.class);
    }
}
