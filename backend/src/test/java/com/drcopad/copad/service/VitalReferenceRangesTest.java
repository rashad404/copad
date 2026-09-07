package com.drcopad.copad.service;

import com.drcopad.copad.entity.AbnormalFlag;
import com.drcopad.copad.entity.FamilyMember;
import com.drcopad.copad.entity.VitalType;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

/**
 * The thresholds a reading is judged against.
 *
 * These decide whether someone is told a number is fine. The two cases fixed in
 * the Phase 10 review are pinned first, because both were wrong in the direction
 * that reassures rather than the direction that alarms.
 */
class VitalReferenceRangesTest {

    private final VitalReferenceRanges ranges = new VitalReferenceRanges();

    private FamilyMember aged(int years) {
        FamilyMember m = new FamilyMember();
        m.setDateOfBirth(LocalDate.now().minusYears(years).minusDays(1));
        return m;
    }

    private FamilyMember agedMonths(int months) {
        FamilyMember m = new FamilyMember();
        m.setDateOfBirth(LocalDate.now().minusMonths(months).minusDays(1));
        return m;
    }

    private AbnormalFlag flag(VitalType type, String value, FamilyMember member) {
        return ranges.evaluate(type, new BigDecimal(value), member);
    }

    @Test
    void shockInAnOlderChildIsCriticalNotMerelyLow() {
        // The defect this review found. Hypotension in a ten-year-old starts
        // around 90; a flat paediatric floor of 70 called this child "low".
        assertEquals(AbnormalFlag.CRITICAL_LOW,
                flag(VitalType.BLOOD_PRESSURE_SYSTOLIC, "85", aged(10)));
        assertEquals(AbnormalFlag.CRITICAL_LOW,
                flag(VitalType.BLOOD_PRESSURE_SYSTOLIC, "78", aged(6)));
    }

    @Test
    void theHypotensionFloorMovesWithAge() {
        // 70 + 2 x age. The same pressure is critical for an older child and
        // merely low for a toddler.
        assertEquals(AbnormalFlag.CRITICAL_LOW,
                flag(VitalType.BLOOD_PRESSURE_SYSTOLIC, "75", aged(8)));
        assertNotEquals(AbnormalFlag.CRITICAL_LOW,
                flag(VitalType.BLOOD_PRESSURE_SYSTOLIC, "75", aged(2)));
    }

    @Test
    void feverInAYoungInfantIsCritical() {
        // Under three months the risk is serious bacterial infection, not the
        // fever. "High" is the wrong word for the one age where this is an
        // emergency.
        assertEquals(AbnormalFlag.CRITICAL_HIGH,
                flag(VitalType.TEMPERATURE, "38.2", agedMonths(2)));
        // The same reading in an older child is high, and not an emergency.
        assertEquals(AbnormalFlag.HIGH,
                flag(VitalType.TEMPERATURE, "38.2", aged(5)));
    }

    @Test
    void anAdultPulseIsJudgedAgainstAnAdultRange() {
        assertEquals(AbnormalFlag.NORMAL, flag(VitalType.PULSE, "72", aged(30)));
        assertEquals(AbnormalFlag.HIGH, flag(VitalType.PULSE, "110", aged(30)));
        assertEquals(AbnormalFlag.CRITICAL_HIGH, flag(VitalType.PULSE, "170", aged(30)));
    }

    @Test
    void anInfantPulseIsNotJudgedAgainstAnAdultRange() {
        // 130 is expected in an infant and an emergency in an adult.
        assertEquals(AbnormalFlag.NORMAL, flag(VitalType.PULSE, "130", agedMonths(6)));
        assertEquals(AbnormalFlag.HIGH, flag(VitalType.PULSE, "130", aged(30)));
    }

    @Test
    void lowOxygenSaturationIsCritical() {
        assertEquals(AbnormalFlag.CRITICAL_LOW, flag(VitalType.OXYGEN_SATURATION, "88", aged(30)));
        assertEquals(AbnormalFlag.NORMAL, flag(VitalType.OXYGEN_SATURATION, "97", aged(30)));
    }

    @Test
    void nothingIsAssertedWhereThereIsNoDefensibleRange() {
        // Weight and height need growth charts; a childhood BMI needs
        // percentiles. Saying nothing beats a confident wrong flag.
        assertNull(flag(VitalType.WEIGHT, "70", aged(30)));
        assertNull(flag(VitalType.HEIGHT, "170", aged(30)));
        assertNull(flag(VitalType.BMI, "22", aged(10)));
        assertNotNull(flag(VitalType.BMI, "22", aged(30)));
    }

    @Test
    void anUnknownAgeFallsBackToAdultRanges() {
        // The only defensible default, and it under-flags rather than alarming.
        assertEquals(AbnormalFlag.NORMAL, flag(VitalType.PULSE, "72", new FamilyMember()));
        assertEquals(AbnormalFlag.NORMAL, flag(VitalType.PULSE, "72", null));
    }
}
