package com.drcopad.copad.service;

import com.drcopad.copad.entity.MedicationRoute;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * A misread prescription line becomes a medication somebody takes, so the
 * formats that actually turn up are pinned here.
 */
class PrescriptionParserTest {

    private final PrescriptionParser parser = new PrescriptionParser();

    @Test
    void readsANumberedLine() {
        List<PrescriptionParser.ParsedMedication> found =
                parser.parse("1. Amoksisillin 500 mg - gündə 3 dəfə, 7 gün");

        assertEquals(1, found.size());
        PrescriptionParser.ParsedMedication m = found.get(0);
        assertEquals("Amoksisillin", m.name());
        assertEquals(0, m.doseAmount().compareTo(new BigDecimal("500")));
        assertEquals("mg", m.doseUnit());
        assertEquals("3 times a day", m.frequency());
        assertEquals(7, m.durationDays());
    }

    @Test
    void readsADecimalComma() {
        // "0,5 g" read as "0" would be a tenfold error, in the direction that
        // matters.
        var m = parser.parse("Paracetamol 0,5 q").get(0);
        assertEquals(0, m.doseAmount().compareTo(new BigDecimal("0.5")));
        assertEquals("g", m.doseUnit());
    }

    @Test
    void normalisesUnitSpellings() {
        assertEquals("mg", parser.parse("Ibuprofen 200 mq").get(0).doseUnit());
        assertEquals("mg", parser.parse("Ibuprofen 200 мг").get(0).doseUnit());
        assertEquals("mcg", parser.parse("Levotiroksin 50 mkg").get(0).doseUnit());
        assertEquals("ml", parser.parse("Sirop 5 ml").get(0).doseUnit());
    }

    @Test
    void readsFrequencyInEitherWordOrder() {
        assertEquals("2 times a day", parser.parse("Omeprazol 20 mg gündə 2 dəfə").get(0).frequency());
        assertEquals("3 times a day", parser.parse("Omeprazol 20 mg 3 dəfə gündə").get(0).frequency());
        assertEquals("2 times a day", parser.parse("Omeprazol 20 mg 2 раза").get(0).frequency());
        assertEquals("2 times a day", parser.parse("Omeprazol 20 mg twice daily").get(0).frequency());
        assertEquals("3 times a day", parser.parse("Omeprazol 20 mg TID").get(0).frequency());
        assertEquals("2 times a day", parser.parse("Omeprazol 20 mg 2 times a day").get(0).frequency());
    }

    @Test
    void writesASingleDoseAsSingular() {
        assertEquals("1 time a day", parser.parse("Probiotik kapsul - gunde 1 defe").get(0).frequency());
    }

    @Test
    void readsASlotSchedule() {
        // "1-0-1" is morning and evening, which is two doses, not three.
        assertEquals("2 times a day", parser.parse("Metformin 850 mg 1-0-1").get(0).frequency());
        assertEquals("3 times a day", parser.parse("Metformin 850 mg 1-1-1").get(0).frequency());
    }

    @Test
    void keepsADrugThatHasNoDose() {
        // Dropping it would silently lose a medication from a list whose value
        // is being complete.
        var found = parser.parse("Vitamin D3 damcı");
        assertEquals(1, found.size());
        assertNull(found.get(0).doseAmount());
        assertTrue(found.get(0).name().startsWith("Vitamin D3"));
    }

    @Test
    void readsTheRouteWhenTheFormSaysIt() {
        assertEquals(MedicationRoute.ORAL, parser.parse("Aspirin 100 mg tablet").get(0).route());
        assertEquals(MedicationRoute.TOPICAL, parser.parse("Hidrokortizon krem").get(0).route());
        assertEquals(MedicationRoute.INJECTION, parser.parse("Seftriakson 1 g ampul").get(0).route());
        assertNull(parser.parse("Amoksisillin 500 mg").get(0).route());
    }

    @Test
    void ignoresHeaderAndAdministrativeLines() {
        String prescription = """
                Klinika: Merkezi Xestexana
                Həkim: Dr. Elnur Memmedov
                Pasiyent: Aygun Memmedova
                Tarix: 12.03.2026
                Diaqnoz: Faringit
                Rp.: Amoksisillin 500 mg
                """;
        List<PrescriptionParser.ParsedMedication> found = parser.parse(prescription);
        assertEquals(1, found.size(), found.toString());
        assertEquals("Amoksisillin", found.get(0).name());
    }

    @Test
    void doesNotProposeAPatientNameAsADrug() {
        // Both wrong and a privacy problem once it sits in a shared list.
        assertTrue(parser.parse("Pasiyent: Aygun Memmedova").isEmpty());
        assertTrue(parser.parse("Həkim: Dr. Elnur Memmedov").isEmpty());
    }

    @Test
    void readsAMultiLinePrescription() {
        String prescription = """
                1. Amoksisillin 500 mg - gündə 3 dəfə, 7 gün
                2. Ibuprofen 400 mg - gündə 2 dəfə
                3. Probiotik kapsul - gündə 1 dəfə
                """;
        List<PrescriptionParser.ParsedMedication> found = parser.parse(prescription);
        assertEquals(3, found.size(), found.toString());
        assertEquals("Ibuprofen", found.get(1).name());
        assertEquals(MedicationRoute.ORAL, found.get(2).route());
    }

    @Test
    void doesNotRepeatADrugNamedTwice() {
        // A name line followed by its own instruction line is one medication.
        String prescription = """
                Amoksisillin 500 mg
                Amoksisillin: gündə 3 dəfə
                """;
        assertEquals(1, parser.parse(prescription).size());
    }

    @Test
    void rejectsAnImplausibleDuration() {
        // Usually a misread date or pack count rather than a real course.
        assertNull(parser.parse("Aspirin 100 mg 3650 gün").get(0).durationDays());
    }

    @Test
    void readsALineWithTheDiacriticsStripped() {
        // Text extraction drops them and people type without them, so a parser
        // that only handles "gundə 3 dəfə" handles almost no real document.
        var m = parser.parse("1. Amoksisillin 500 mg - gunde 3 defe, 7 gun").get(0);
        assertEquals("Amoksisillin", m.name());
        assertEquals("3 times a day", m.frequency());
        assertEquals(7, m.durationDays());
    }

    @Test
    void stillIgnoresAStrippedHeaderLine() {
        assertTrue(parser.parse("Hekim: Dr. Elnur Memmedov").isEmpty());
        assertTrue(parser.parse("Xeste: Aygun Memmedova").isEmpty());
    }

    @Test
    void isEmptyForTextThatIsNotAPrescription() {
        assertTrue(parser.parse("").isEmpty());
        assertTrue(parser.parse(null).isEmpty());
        assertTrue(parser.parse("12.03.2026\n20 N\n1 2 3").isEmpty());
    }
}
