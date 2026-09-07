package com.drcopad.copad.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.util.ReflectionTestUtils;

import java.lang.reflect.Method;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Which words trigger a drug lookup.
 *
 * Getting this wrong is expensive in both directions: too loose and a question
 * about a headache comes back with prices attached to a word that happened to
 * match, too tight and the one thing a general assistant cannot answer never
 * fires.
 */
class MedicineContextServiceTest {

    private MedicineContextService service;

    @BeforeEach
    void setUp() {
        service = new MedicineContextService(null);
    }

    @SuppressWarnings("unchecked")
    private List<String> candidates(String message) throws Exception {
        Method m = MedicineContextService.class.getDeclaredMethod("candidates", String.class);
        m.setAccessible(true);
        return (List<String>) m.invoke(service, message);
    }

    @Test
    void picksOutWordsThatCouldBeADrug() throws Exception {
        assertTrue(candidates("Nurofen qiymeti nece manatdir?").contains("nurofen"));
    }

    @Test
    void keepsAzerbaijaniLetters() throws Exception {
        // Stripping them would turn "Qlükoza" into two fragments that match
        // nothing.
        assertTrue(candidates("Qlükoza haqqında sual").contains("qlükoza"));
    }

    @Test
    void ignoresNumbersAndDosages() throws Exception {
        List<String> words = candidates("200 mg 12.03.2026");
        assertFalse(words.contains("200"));
        assertFalse(words.contains("12.03.2026"));
    }

    @Test
    void ignoresVeryShortWords() throws Exception {
        // Two letters cannot identify a product and would match noise.
        assertFalse(candidates("ne is bu").contains("ne"));
    }

    @Test
    void dropsWordsThatAreAlsoOrdinaryLanguage() throws Exception {
        assertFalse(candidates("su icmeliyem").contains("su"));
    }

    @Test
    void isEmptyForAMessageWithNoWords() throws Exception {
        assertTrue(candidates("").isEmpty());
        assertTrue(candidates(null).isEmpty());
        assertTrue(candidates("123 456").isEmpty());
    }

    @Test
    void boundsHowManyWordsAreLookedUp() throws Exception {
        // One query per message, and its size cannot grow with a long message.
        String longMessage = "aaaa bbbb cccc dddd eeee ffff gggg hhhh iiii jjjj "
                + "kkkk llll mmmm nnnn oooo pppp";
        assertTrue(candidates(longMessage).size() <= 12);
    }

    @Test
    void doesNotRepeatAWord() throws Exception {
        assertEquals(1, candidates("nurofen nurofen NUROFEN").size());
    }

    @Test
    void addsNothingWhenNoWordCouldBeADrug() {
        // The common case, and it must not reach the database at all: the
        // JdbcTemplate here is null, so a query would throw.
        assertEquals("", service.contextFor("123"));
        assertEquals("", service.contextFor(""));
        assertEquals("", service.contextFor(null));
    }
}
