package com.drcopad.copad.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * What leaves the country with a document.
 *
 * Both directions matter equally. Failing to remove a name sends it abroad;
 * removing too much sends a report with the values stripped out, and the
 * assistant then answers confidently about a report it cannot see.
 */
class DeidentifierTest {

    private final Deidentifier deidentifier = new Deidentifier();

    @Test
    void removesThePatientAndDoctorFromALetterhead() {
        String report = """
                Laboratoriya: Referans Lab
                Pasiyent: Aygün Məmmədova
                Həkim: Dr. Elnur Məmmədov
                Hemoglobin 9,1 q/dL 12,0 - 16,0
                """;
        String cleaned = deidentifier.clean(report);

        assertFalse(cleaned.contains("Aygün"));
        assertFalse(cleaned.contains("Elnur"));
        // The part the assistant actually needs survives intact.
        assertTrue(cleaned.contains("Hemoglobin 9,1 q/dL 12,0 - 16,0"));
    }

    @Test
    void worksWithoutDiacritics() {
        // Extraction drops them and people type without them.
        String cleaned = deidentifier.clean("Xeste: Aygun Memmedova\nQlukoza 5,4 mmol/L");
        assertFalse(cleaned.contains("Aygun"));
        assertTrue(cleaned.contains("Qlukoza 5,4 mmol/L"));
    }

    @Test
    void removesRussianHeaders() {
        String cleaned = deidentifier.clean("Пациент: Иванов И.И.\nГемоглобин 9,1");
        assertFalse(cleaned.contains("Иванов"));
        assertTrue(cleaned.contains("Гемоглобин 9,1"));
    }

    @Test
    void removesContactDetailsWhereverTheyAppear() {
        String cleaned = deidentifier.clean(
                "Klinika xetti +994 50 123 45 67, yazin info@clinic.az\nXolesterin 7,2");
        assertFalse(cleaned.contains("994"));
        assertFalse(cleaned.contains("info@clinic.az"));
        assertTrue(cleaned.contains("Xolesterin 7,2"));
    }

    @Test
    void keepsTheClinicalContentUntouched() {
        // The failure that would matter most: an over-eager filter leaves the
        // model reasoning about a report with its values removed.
        String report = """
                Hemoglobin 9,1 q/dL 12,0 - 16,0
                Eritrosit 3,8 10^12/L 4,2 - 5,4
                Leykosit 11,2 10^9/L 4,0 - 9,0
                Qlükoza 5,4 mmol/L 3,9 - 6,1
                Diaqnoz: Anemiya
                """;
        assertEquals(report, deidentifier.clean(report));
    }

    @Test
    void doesNotTouchAClinicalWordThatLooksLikeALabel() {
        // "Ad" means name, but "Adrenalin" is a drug. A prefix match would eat
        // it.
        String text = "Adrenalin 1 mg\nNoradrenalin infuziya";
        assertEquals(text, deidentifier.clean(text));
    }

    @Test
    void anAttachmentIsLabelledNotNamed() {
        // Files are named after patients. The label carries no information the
        // content does not, so there is nothing to lose by dropping it.
        assertEquals("document 1", deidentifier.labelFor("application/pdf", 1));
        assertEquals("image 2", deidentifier.labelFor("image/jpeg", 2));
    }

    @Test
    void emptyInputIsHandled() {
        assertNull(deidentifier.clean(null));
        assertEquals("", deidentifier.clean(""));
    }
}
