package com.drcopad.copad.service;

import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * The catalogue's ingredient strings are the messiest input in the system and
 * the allergy check depends entirely on parsing them, so the shapes that
 * actually appear in the data are pinned here.
 */
class IngredientNormaliserTest {

    private final IngredientNormaliser normaliser = new IngredientNormaliser();

    @Test
    void stripsDosageFromASingleIngredient() {
        assertEquals(Set.of("ibuprofen"), normaliser.parse("Ibuprofen - 200 mg/5 ml"));
    }

    @Test
    void stripsSaltFormsSoTheBaseDrugRemains() {
        assertEquals("amoxicillin", normaliser.normalise("Amoxicillin trihydrate - 500 mg"));
        assertEquals("metformin", normaliser.normalise("Metformin hydrochloride"));
    }

    @Test
    void dropsEquivalenceParentheticals() {
        assertEquals("amoxicillin",
                normaliser.normalise("Amoxicillin trihydrate - 500 mg (eq. to Amoxicillin 500 mg)"));
    }

    @Test
    void splitsMultiIngredientProducts() {
        Set<String> parsed = normaliser.parse(
                "Lecithin (PC 35%) - 857.13 mg, Thiamine mononitrate (vit B1) - 10 mg, "
                        + "Riboflavin (vit B2 ) - 7.80 mg");
        assertTrue(parsed.contains("lecithin"), parsed.toString());
        assertTrue(parsed.contains("thiamine"), parsed.toString());
        assertTrue(parsed.contains("riboflavin"), parsed.toString());
    }

    @Test
    void foldsAzerbaijaniLetters() {
        assertEquals("sekerli", normaliser.normalise("Şəkərli"));
    }

    @Test
    void matchesAllergenAgainstASaltForm() {
        assertTrue(normaliser.matches("Amoxicillin", "amoxicillin"));
        assertTrue(normaliser.matches("Penicillin", "phenoxymethylpenicillin"));
    }

    @Test
    void doesNotMatchUnrelatedDrugs() {
        assertFalse(normaliser.matches("Penicillin", "paracetamol"));
        assertFalse(normaliser.matches("Ibuprofen", "metformin"));
    }

    @Test
    void ignoresFragmentsTooShortToBeMeaningful() {
        // A three-letter allergen would otherwise match a large share of the
        // catalogue and make every warning worthless.
        assertFalse(normaliser.matches("ac", "paracetamol"));
    }
}
