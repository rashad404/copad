package com.drcopad.copad.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * A typed result and an extracted one must chart together.
 *
 * If they do not, someone who types "Hemoglobin" gets a second series beside
 * the "HGB" read off their reports, and the trend - the whole reason to keep
 * results over time - is split in two without anyone noticing.
 */
class LabReportParserKeyTest {

    private final LabReportParser parser = new LabReportParser();

    @Test
    void abbreviationAndFullNameShareAKey() {
        assertEquals(parser.canonicalKey("Hemoglobin"), parser.canonicalKey("HGB"));
        assertEquals(parser.canonicalKey("Hemoglobin"), parser.canonicalKey("Hemoqlobin"));
    }

    @Test
    void spellingAndCaseDoNotSplitASeries() {
        // What a person types is not what a laboratory prints.
        assertEquals(parser.canonicalKey("Qlükoza"), parser.canonicalKey("qlukoza"));
        assertEquals(parser.canonicalKey("Xolesterin"), parser.canonicalKey("  XOLESTERIN  "));
    }

    @Test
    void aTypedKeyMatchesWhatExtractionProduces() {
        // The key extraction assigns is the key manual entry must produce.
        var extracted = parser.parse("HGB 13.1 g/dL").get(0);
        assertEquals(extracted.analyteKey(), parser.canonicalKey("Hemoglobin"));
    }

    @Test
    void differentTestsDoNotCollide() {
        assertNotEquals(parser.canonicalKey("Hemoglobin"), parser.canonicalKey("Qlükoza"));
        assertNotEquals(parser.canonicalKey("Xolesterin"), parser.canonicalKey("Trombosit"));
    }

    @Test
    void emptyInputIsHandled() {
        assertEquals("", parser.canonicalKey(null));
        assertEquals("", parser.canonicalKey("   "));
    }
}
