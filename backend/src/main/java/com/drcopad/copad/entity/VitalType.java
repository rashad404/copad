package com.drcopad.copad.entity;

import java.math.BigDecimal;

/**
 * The vital signs the record tracks.
 *
 * Each type declares one canonical unit and a plausibility range. The range is
 * not a clinical reference range - it is a sanity bound that rejects impossible
 * input, such as a 900 kg weight or a body temperature of 5 degrees, which are
 * almost always a wrong unit or a typo rather than a real measurement.
 */
public enum VitalType {

    WEIGHT("kg", new BigDecimal("0.3"), new BigDecimal("500")),
    HEIGHT("cm", new BigDecimal("20"), new BigDecimal("260")),

    /** Derived from weight and height rather than entered directly. */
    BMI("kg/m2", new BigDecimal("5"), new BigDecimal("100")),

    BLOOD_PRESSURE_SYSTOLIC("mmHg", new BigDecimal("50"), new BigDecimal("300")),
    BLOOD_PRESSURE_DIASTOLIC("mmHg", new BigDecimal("20"), new BigDecimal("200")),

    PULSE("bpm", new BigDecimal("20"), new BigDecimal("250")),
    RESPIRATORY_RATE("breaths/min", new BigDecimal("4"), new BigDecimal("80")),

    TEMPERATURE("C", new BigDecimal("25"), new BigDecimal("45")),

    /**
     * Canonical mmol/L. The mg/dL form of the same value differs by a factor of
     * about 18, so a reading stored without its unit is not merely ambiguous -
     * it is dangerous.
     */
    BLOOD_GLUCOSE("mmol/L", new BigDecimal("0.5"), new BigDecimal("60")),

    OXYGEN_SATURATION("%", new BigDecimal("40"), new BigDecimal("100")),
    WAIST_CIRCUMFERENCE("cm", new BigDecimal("20"), new BigDecimal("250")),
    HEAD_CIRCUMFERENCE("cm", new BigDecimal("20"), new BigDecimal("70"));

    private final String canonicalUnit;
    private final BigDecimal plausibleMin;
    private final BigDecimal plausibleMax;

    VitalType(String canonicalUnit, BigDecimal plausibleMin, BigDecimal plausibleMax) {
        this.canonicalUnit = canonicalUnit;
        this.plausibleMin = plausibleMin;
        this.plausibleMax = plausibleMax;
    }

    public String canonicalUnit() {
        return canonicalUnit;
    }

    public boolean isPlausible(BigDecimal canonicalValue) {
        return canonicalValue != null
                && canonicalValue.compareTo(plausibleMin) >= 0
                && canonicalValue.compareTo(plausibleMax) <= 0;
    }

    public String plausibleRangeLabel() {
        return plausibleMin.stripTrailingZeros().toPlainString() + "-"
                + plausibleMax.stripTrailingZeros().toPlainString() + " " + canonicalUnit;
    }
}
