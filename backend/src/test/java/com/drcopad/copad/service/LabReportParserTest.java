package com.drcopad.copad.service;

import com.drcopad.copad.entity.AbnormalFlag;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Lab report text is the least predictable input in the system, and a misread
 * value goes into a medical record, so the shapes that actually appear in
 * Azerbaijani reports are pinned here.
 */
class LabReportParserTest {

    private final LabReportParser parser = new LabReportParser();

    @Test
    void readsATabularRowWithUnitAndRange() {
        List<LabReportParser.ParsedResult> results =
                parser.parse("Hemoglobin        14.2    g/dL     12.0 - 16.0");

        assertEquals(1, results.size());
        LabReportParser.ParsedResult r = results.get(0);
        assertEquals("Hemoglobin", r.analyte());
        assertEquals("hemoglobin", r.analyteKey());
        assertEquals(0, r.value().compareTo(new java.math.BigDecimal("14.2")));
        assertEquals("g/dL", r.unit());
        assertEquals(AbnormalFlag.NORMAL, r.flag());
    }

    @Test
    void readsDecimalCommas() {
        // Azerbaijani and Russian reports use a comma. Reading 5,4 as 5 would
        // be wrong by an order of magnitude on a glucose result.
        List<LabReportParser.ParsedResult> results =
                parser.parse("Qlükoza  5,4  mmol/L  3,9 - 6,1");

        assertEquals(1, results.size());
        assertEquals(0, results.get(0).value().compareTo(new java.math.BigDecimal("5.4")));
        assertEquals("glucose", results.get(0).analyteKey());
    }

    @Test
    void mapsAbbreviationsOntoOneAnalyte() {
        assertEquals("hemoglobin", parser.parse("HGB 13.1 g/dL").get(0).analyteKey());
        assertEquals("hemoglobin", parser.parse("Hemoqlobin 13.1 g/dL").get(0).analyteKey());
        assertEquals("platelets", parser.parse("Trombosit 250 10^9/L").get(0).analyteKey());
    }

    @Test
    void flagsAgainstTheReportsOwnRange() {
        assertEquals(AbnormalFlag.HIGH,
                parser.parse("Xolesterin 7.2 mmol/L 3.0 - 5.2").get(0).flag());
        assertEquals(AbnormalFlag.LOW,
                parser.parse("Hemoglobin 9.1 g/dL 12.0 - 16.0").get(0).flag());
    }

    @Test
    void doesNotFlagWithoutARange() {
        // Ranges differ by laboratory and method. Substituting a generic one
        // would produce a confident wrong answer.
        assertNull(parser.parse("Ferritin 15 ng/mL").get(0).flag());
    }

    @Test
    void ignoresHeaderAndAdministrativeLines() {
        String report = """
                Laboratoriya: Referans Lab
                Tarix: 12.03.2026
                Pasiyent: Aygun Memmedova
                Yas: 34
                Telefon: 0501234567
                Hemoglobin 13.5 g/dL 12.0 - 16.0
                """;
        List<LabReportParser.ParsedResult> results = parser.parse(report);
        assertEquals(1, results.size(), results.toString());
        assertEquals("hemoglobin", results.get(0).analyteKey());
    }

    @Test
    void ignoresLinesWithoutAUsableLabel() {
        assertTrue(parser.parse("1 2 3").isEmpty());
        assertTrue(parser.parse("12.03.2026").isEmpty());
        assertTrue(parser.parse("").isEmpty());
    }

    @Test
    void doesNotTreatANeighbouringColumnAsAUnit() {
        // Flattened tables leave the next column adjacent; a bare number is not
        // a unit and must not be stored as one.
        LabReportParser.ParsedResult r = parser.parse("Kreatinin 88 106").get(0);
        assertNull(r.unit());
    }

    @Test
    void parsesAMultiLineReport() {
        String report = """
                Hemoglobin 13.5 g/dL 12.0 - 16.0
                Leykosit 11.2 10^9/L 4.0 - 9.0
                Qlükoza 5,4 mmol/L 3,9 - 6,1
                """;
        List<LabReportParser.ParsedResult> results = parser.parse(report);
        assertEquals(3, results.size(), results.toString());
        assertEquals(AbnormalFlag.HIGH, results.get(1).flag());
    }
}
