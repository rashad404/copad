package com.drcopad.copad.service;

import org.junit.jupiter.api.Test;

import java.lang.reflect.Method;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

/**
 * Whether a question finds the passage that answers it.
 */
class DocumentRetrievalScoringTest {

    private final DocumentRetrievalService service = new DocumentRetrievalService(
            mock(FamilyService.class), mock(DocumentService.class), new Deidentifier());

    @SuppressWarnings("unchecked")
    private Set<String> terms(String q) throws Exception {
        Method m = DocumentRetrievalService.class.getDeclaredMethod("terms", String.class);
        m.setAccessible(true);
        return (Set<String>) m.invoke(service, q);
    }

    private double score(String passage, Set<String> terms) throws Exception {
        Method m = DocumentRetrievalService.class.getDeclaredMethod("score", String.class, Set.class);
        m.setAccessible(true);
        return (double) m.invoke(service, passage, terms);
    }

    @Test
    void aQuestionAboutTheOperationFindsTheDischargeAdvice() throws Exception {
        String passage = "Tovsiyeler:\n- Agir fiziki is ve idmandan 4 hefte muddetinde cekinmek.";
        assertTrue(score(passage, terms("Emeliyyatdan sonra ne qeder idmandan cekinmeliyem?")) >= 2.0);
    }

    @Test
    void diacriticsDoNotDecideTheMatch() throws Exception {
        // The person types without them; the report prints with them.
        assertTrue(score("Qlükoza 5,4 mmol/L", terms("qlukoza neceydi")) >= 2.0);
        assertTrue(score("Qlukoza 5,4 mmol/L", terms("Qlükoza neceydi")) >= 2.0);
    }

    @Test
    void aWordFoundWithADifferentEndingStillMatches() throws Exception {
        // Azerbaijani builds meaning by suffix. Someone asks about their
        // "epikrizimde" and the document says "epikrizi"; exact matching misses
        // the ordinary case, not an edge one.
        assertTrue(score("Cixaris epikrizi", terms("Epikrizimde ne yazilib?")) > 0);
        assertTrue(score("laparoskopik appendektomiya", terms("appendektomiyadan sonra")) > 0);
    }

    @Test
    void aShortWordIsNotStemmed() throws Exception {
        // Stemming a six-letter word leaves four letters, which match half the
        // dictionary. Short words match exactly or not at all.
        assertEquals(0.0, score("gunluk hesabat burada", terms("gunler")));
    }

    @Test
    void anUnrelatedQuestionScoresNothing() throws Exception {
        assertEquals(0.0, score("Tovsiyeler: idmandan 4 hefte cekinmek.", terms("Hava bugun necedir?")));
    }

    @Test
    void commonWordsAreNotTerms() throws Exception {
        // Otherwise every question matches every document.
        assertFalse(terms("bunun haqqinda ne var").contains("haqqinda"));
        assertFalse(terms("what should this be").contains("should"));
    }

    @Test
    void shortWordsAreNotTerms() throws Exception {
        assertFalse(terms("ne var").contains("ne"));
    }
}
