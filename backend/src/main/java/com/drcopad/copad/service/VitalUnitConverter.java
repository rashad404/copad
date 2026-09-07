package com.drcopad.copad.service;

import com.drcopad.copad.entity.VitalType;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Locale;

/**
 * Converts an entered measurement into its canonical unit.
 *
 * Conversion happens once, at the boundary, and the canonical value is what is
 * stored and compared. The alternative - storing whatever unit arrived and
 * converting on read - means every consumer has to remember, and the one that
 * forgets produces a number that looks reasonable and is wrong by a factor of
 * 2.2 (lb/kg) or 18 (mg/dL to mmol/L).
 *
 * An unrecognised unit is rejected rather than assumed. Guessing that "70"
 * means kilograms is exactly the assumption that produces a wrong record.
 */
@Component
public class VitalUnitConverter {

    /** mg/dL to mmol/L for glucose: divide by the molar mass factor 18.0182. */
    private static final BigDecimal GLUCOSE_MGDL_TO_MMOL = new BigDecimal("18.0182");
    private static final BigDecimal LB_TO_KG = new BigDecimal("0.45359237");
    private static final BigDecimal ST_TO_KG = new BigDecimal("6.35029318");
    private static final BigDecimal IN_TO_CM = new BigDecimal("2.54");

    public record Converted(BigDecimal value, String unit) {
    }

    /**
     * @param type  what is being measured
     * @param value the number as entered
     * @param unit  the unit as entered; null means "already canonical"
     */
    public Converted toCanonical(VitalType type, BigDecimal value, String unit) {
        if (value == null) {
            throw new IllegalArgumentException("A measurement value is required");
        }

        String normalised = unit == null ? null : unit.trim().toLowerCase(Locale.ROOT);
        BigDecimal canonical;

        if (normalised == null || normalised.isBlank()
                || normalised.equals(type.canonicalUnit().toLowerCase(Locale.ROOT))) {
            canonical = value;
        } else {
            canonical = convert(type, value, normalised);
        }

        canonical = canonical.setScale(4, RoundingMode.HALF_UP);

        if (!type.isPlausible(canonical)) {
            // Almost always a wrong unit or a typo. Rejecting is safer than
            // storing a number that will be charted and reasoned about.
            throw new IllegalArgumentException(String.format(
                    "%s of %s %s is outside the plausible range (%s). Check the unit.",
                    type, value.stripTrailingZeros().toPlainString(),
                    unit == null ? type.canonicalUnit() : unit, type.plausibleRangeLabel()));
        }
        return new Converted(canonical, type.canonicalUnit());
    }

    private BigDecimal convert(VitalType type, BigDecimal value, String unit) {
        return switch (type) {
            case WEIGHT -> switch (unit) {
                case "kg", "kgs", "kilogram", "kilograms" -> value;
                case "g", "gram", "grams" -> value.divide(new BigDecimal("1000"), 6, RoundingMode.HALF_UP);
                case "lb", "lbs", "pound", "pounds" -> value.multiply(LB_TO_KG);
                case "st", "stone" -> value.multiply(ST_TO_KG);
                default -> throw unknown(type, unit);
            };
            case HEIGHT, WAIST_CIRCUMFERENCE, HEAD_CIRCUMFERENCE -> switch (unit) {
                case "cm", "centimetre", "centimeter" -> value;
                case "m", "metre", "meter" -> value.multiply(new BigDecimal("100"));
                case "mm" -> value.divide(new BigDecimal("10"), 6, RoundingMode.HALF_UP);
                case "in", "inch", "inches" -> value.multiply(IN_TO_CM);
                case "ft", "foot", "feet" -> value.multiply(new BigDecimal("12")).multiply(IN_TO_CM);
                default -> throw unknown(type, unit);
            };
            case TEMPERATURE -> switch (unit) {
                case "c", "°c", "celsius", "centigrade" -> value;
                case "f", "°f", "fahrenheit" -> value.subtract(new BigDecimal("32"))
                        .multiply(new BigDecimal("5"))
                        .divide(new BigDecimal("9"), 6, RoundingMode.HALF_UP);
                case "k", "kelvin" -> value.subtract(new BigDecimal("273.15"));
                default -> throw unknown(type, unit);
            };
            case BLOOD_GLUCOSE -> switch (unit) {
                case "mmol/l", "mmol" -> value;
                case "mg/dl", "mgdl", "mg" -> value.divide(GLUCOSE_MGDL_TO_MMOL, 6, RoundingMode.HALF_UP);
                default -> throw unknown(type, unit);
            };
            case BLOOD_PRESSURE_SYSTOLIC, BLOOD_PRESSURE_DIASTOLIC -> switch (unit) {
                case "mmhg", "mm hg" -> value;
                case "kpa" -> value.multiply(new BigDecimal("7.50062"));
                default -> throw unknown(type, unit);
            };
            case PULSE, RESPIRATORY_RATE -> switch (unit) {
                case "bpm", "/min", "per minute", "breaths/min" -> value;
                default -> throw unknown(type, unit);
            };
            case OXYGEN_SATURATION -> switch (unit) {
                case "%", "percent", "pct" -> value;
                default -> throw unknown(type, unit);
            };
            case BMI -> switch (unit) {
                case "kg/m2", "kg/m^2" -> value;
                default -> throw unknown(type, unit);
            };
        };
    }

    private IllegalArgumentException unknown(VitalType type, String unit) {
        return new IllegalArgumentException(
                "Unrecognised unit '" + unit + "' for " + type + ". Expected " + type.canonicalUnit()
                        + " or a convertible unit.");
    }

    /** BMI from canonical kilograms and centimetres. */
    public BigDecimal bmi(BigDecimal weightKg, BigDecimal heightCm) {
        if (weightKg == null || heightCm == null || heightCm.signum() <= 0) return null;
        BigDecimal metres = heightCm.divide(new BigDecimal("100"), 6, RoundingMode.HALF_UP);
        return weightKg.divide(metres.multiply(metres), 2, RoundingMode.HALF_UP);
    }
}
