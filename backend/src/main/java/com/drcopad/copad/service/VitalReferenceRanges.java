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
            case BLOOD_PRESSURE_SYSTOLIC -> systolicRange(age);
            case BLOOD_PRESSURE_DIASTOLIC -> diastolicRange(age);
            case TEMPERATURE -> temperatureRange(member);
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

    /**
     * Systolic pressure, with a hypotension threshold that moves with age.
     *
     * This is the correction that mattered most in the Phase 10 review. A single
     * paediatric floor of 70 mmHg is the published figure for a one-year-old and
     * far too low for an older child: shock in a ten-year-old begins around 90,
     * so a flat 70 would have called a child in circulatory failure merely
     * "low". The widely taught rule is 70 + 2 x age for ages one to ten, and 90
     * from there on.
     *
     * The normal band stays deliberately wide. Real paediatric thresholds depend
     * on age, sex and height percentile together, and until those charts are in
     * the record this should miss borderline hypertension rather than invent it.
     */
    private Range systolicRange(int age) {
        if (age < 1) return Range.of("72", "104", "60", "120");
        if (age <= 10) {
            int criticalLow = 70 + (2 * age);
            int low = criticalLow + 5;
            int high = 100 + (2 * age);
            return new Range(BigDecimal.valueOf(low), BigDecimal.valueOf(high),
                    BigDecimal.valueOf(criticalLow), BigDecimal.valueOf(high + 20));
        }
        if (age < 13) return Range.of("95", "120", "90", "150");
        return Range.of("90", "129", "80", "180");
    }

    private Range diastolicRange(int age) {
        if (age < 1) return Range.of("37", "56", "30", "70");
        if (age < 6) return Range.of("40", "70", "35", "85");
        if (age < 13) return Range.of("45", "78", "40", "90");
        return Range.of("60", "84", "50", "120");
    }

    /**
     * Temperature, with fever in a young infant treated as critical.
     *
     * A rectal temperature of 38.0 in a baby under three months is a medical
     * emergency regardless of how well the baby appears, because the risk is
     * serious bacterial infection rather than the fever itself. The general
     * adult threshold of 39.5 would have flagged such a reading merely "high",
     * which is the wrong word for the one age group where a modest fever is the
     * emergency.
     */
    private Range temperatureRange(FamilyMember member) {
        Integer months = member == null ? null : member.getAgeMonths();
        if (months != null && months < 3) {
            return Range.of("36.1", "37.9", "35.5", "37.9");
        }
        return Range.of("36.1", "37.5", "35.0", "39.5");
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
