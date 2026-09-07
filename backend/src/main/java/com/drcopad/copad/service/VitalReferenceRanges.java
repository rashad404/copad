package com.drcopad.copad.service;

import com.drcopad.copad.entity.AbnormalFlag;
import com.drcopad.copad.entity.BiologicalSex;
import com.drcopad.copad.entity.FamilyMember;
import com.drcopad.copad.entity.VitalType;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Decides whether a reading is normal for this particular person.
 *
 * Age matters more than anything else here. A resting pulse of 130 is expected
 * in an infant and a medical emergency in an adult, so a single adult range
 * applied to a child would either bury real findings or alarm every parent.
 *
 * These are screening thresholds for flagging a reading in a personal health
 * record, drawn from widely published adult and paediatric vital sign ranges.
 * They are not a diagnostic standard and deliberately err toward flagging.
 * A clinician should review them before this is presented as clinical guidance
 * (tracked in the Phase 10 clinical safety review).
 */
@Component
public class VitalReferenceRanges {

    /** Inclusive normal band, plus the points beyond which a reading is critical. */
    public record Range(BigDecimal low, BigDecimal high,
                        BigDecimal criticalLow, BigDecimal criticalHigh) {

        static Range of(String low, String high, String criticalLow, String criticalHigh) {
            return new Range(new BigDecimal(low), new BigDecimal(high),
                    criticalLow == null ? null : new BigDecimal(criticalLow),
                    criticalHigh == null ? null : new BigDecimal(criticalHigh));
        }
    }

    /**
     * @return the flag for this reading, or null when no range is defined for
     *         the type - in which case nothing should be asserted about it
     */
    public AbnormalFlag evaluate(VitalType type, BigDecimal canonicalValue, FamilyMember member) {
        Range range = rangeFor(type, member);
        if (range == null || canonicalValue == null) return null;

        if (range.criticalLow() != null && canonicalValue.compareTo(range.criticalLow()) < 0) {
            return AbnormalFlag.CRITICAL_LOW;
        }
        if (range.criticalHigh() != null && canonicalValue.compareTo(range.criticalHigh()) > 0) {
            return AbnormalFlag.CRITICAL_HIGH;
        }
        if (canonicalValue.compareTo(range.low()) < 0) return AbnormalFlag.LOW;
        if (canonicalValue.compareTo(range.high()) > 0) return AbnormalFlag.HIGH;
        return AbnormalFlag.NORMAL;
    }

    public Range rangeFor(VitalType type, FamilyMember member) {
        Integer ageYears = member == null ? null : member.getAgeYears();
        // With no date of birth an adult range is the only defensible default,
        // and it is the one that under-flags rather than over-flags for adults.
        int age = ageYears == null ? 30 : ageYears;
        BiologicalSex sex = member == null ? null : member.getBiologicalSex();

        return switch (type) {
            case PULSE -> pulseRange(age);
            case RESPIRATORY_RATE -> respiratoryRange(age);
            case BLOOD_PRESSURE_SYSTOLIC -> age < 13
                    ? Range.of("80", "115", "70", "140")
                    : Range.of("90", "129", "80", "180");
            case BLOOD_PRESSURE_DIASTOLIC -> age < 13
                    ? Range.of("50", "75", "40", "90")
                    : Range.of("60", "84", "50", "120");
            case TEMPERATURE -> Range.of("36.1", "37.5", "35.0", "39.5");
            case OXYGEN_SATURATION -> Range.of("95", "100", "90", null);
            // Fasting reference; a post-meal reading will flag high, which is
            // why the flag is advisory and the note field exists.
            case BLOOD_GLUCOSE -> Range.of("3.9", "7.8", "3.0", "20.0");
            case BMI -> age < 18 ? null : Range.of("18.5", "24.9", "15.0", "40.0");
            // Weight and height are meaningless without growth charts, which
            // arrive with the paediatric percentile work; flagging them against
            // a flat range would be worse than saying nothing.
            case WEIGHT, HEIGHT, WAIST_CIRCUMFERENCE, HEAD_CIRCUMFERENCE -> null;
        };
    }

    private Range pulseRange(int age) {
        if (age < 1) return Range.of("100", "160", "80", "190");
        if (age < 3) return Range.of("90", "150", "70", "180");
        if (age < 6) return Range.of("80", "140", "65", "170");
        if (age < 12) return Range.of("70", "120", "55", "160");
        if (age < 18) return Range.of("60", "100", "45", "150");
        return Range.of("60", "100", "40", "150");
    }

    private Range respiratoryRange(int age) {
        if (age < 1) return Range.of("30", "60", "20", "70");
        if (age < 3) return Range.of("24", "40", "18", "55");
        if (age < 6) return Range.of("22", "34", "16", "45");
        if (age < 12) return Range.of("18", "30", "14", "40");
        return Range.of("12", "20", "8", "32");
    }
}
