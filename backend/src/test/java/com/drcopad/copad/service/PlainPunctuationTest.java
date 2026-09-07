package com.drcopad.copad.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * The rule the product is held to, applied to what the model actually sends.
 */
class PlainPunctuationTest {

    @Test
    void replacesDashes() {
        assertEquals("Parasetamol 500 mg - hər 6 saatda",
                PlainPunctuation.apply("Parasetamol 500 mg – hər 6 saatda"));
        assertEquals("8-10 stəkan", PlainPunctuation.apply("8—10 stəkan"));
    }

    @Test
    void replacesQuotesIncludingGuillemets() {
        assertEquals("\"Nurofen\"", PlainPunctuation.apply("“Nurofen”"));
        assertEquals("\"Nurofen\"", PlainPunctuation.apply("«Nurofen»"));
        assertEquals("it's", PlainPunctuation.apply("it’s"));
    }

    @Test
    void replacesEllipsisAndBullets() {
        assertEquals("davam...", PlainPunctuation.apply("davam…"));
        assertEquals("- bir", PlainPunctuation.apply("• bir"));
    }

    @Test
    void replacesSpacesThatAreNotSpaces() {
        assertEquals("1 200 mg", PlainPunctuation.apply("1 200 mg"));
    }

    @Test
    void leavesAzerbaijaniLettersAlone() {
        // Content, not typography.
        String text = "Şəkərli diabet, ürək, ağrı, İbuprofen, çənə, öskürək";
        assertEquals(text, PlainPunctuation.apply(text));
    }

    @Test
    void leavesOrdinaryTextUnchanged() {
        assertEquals("Nurofen 2.32-4.27 AZN", PlainPunctuation.apply("Nurofen 2.32-4.27 AZN"));
        assertNull(PlainPunctuation.apply(null));
        assertEquals("", PlainPunctuation.apply(""));
    }
}
