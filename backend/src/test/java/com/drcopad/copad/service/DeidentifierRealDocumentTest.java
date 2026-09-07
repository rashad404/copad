package com.drcopad.copad.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIf;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

/**
 * The claim, checked against a real file rather than a hand-written string.
 *
 * A redaction test that invents its own input proves the regex matches the
 * regex. This runs the actual extraction path over an actual PDF, because the
 * text a PDF stripper produces is not the text anyone would have typed.
 */
class DeidentifierRealDocumentTest {

    private static final String SAMPLE =
            "/private/tmp/claude-501/-Users-macmini-projects-azdoc/"
                    + "fc012176-9bf9-414c-bfc1-94fd3fc4087b/scratchpad/named.pdf";

    static boolean sampleExists() {
        return Files.isReadable(Path.of(SAMPLE));
    }

    @Test
    @EnabledIf("sampleExists")
    void aPatientNameDoesNotSurviveExtraction() throws Exception {
        var extraction = new DocumentExtractionService(mock(VisionOcrService.class));
        String text = extraction.extractText(
                Files.readAllBytes(Path.of(SAMPLE)), "application/pdf");

        assertNotNull(text);
        // The letterhead is in the extracted text, which is what makes the
        // test meaningful.
        assertTrue(text.contains("Aygun"), "the sample must actually contain a name");

        String cleaned = new Deidentifier().clean(text);

        assertFalse(cleaned.contains("Aygun"), "the patient's name reached the model");
        assertFalse(cleaned.contains("Memmedova"), "the patient's surname reached the model");
        assertFalse(cleaned.contains("Elnur"), "the doctor's name reached the model");
        assertFalse(cleaned.contains("994"), "a phone number reached the model");

        // And the reason the document was sent at all still survives.
        assertTrue(cleaned.contains("Hemoglobin"));
        assertTrue(cleaned.contains("9,1"));
        assertTrue(cleaned.contains("12,0 - 16,0"));
        assertTrue(cleaned.contains("Xolesterin"));
    }
}
