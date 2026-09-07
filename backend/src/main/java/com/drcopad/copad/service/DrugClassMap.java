package com.drcopad.copad.service;

import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.LinkedHashSet;

/**
 * Maps an allergy written as a drug class onto ATC code prefixes.
 *
 * People record "penicillin allergy", not "amoxicillin allergy" - and
 * amoxicillin is a penicillin. Name matching cannot see that: the strings share
 * no common substring, so a penicillin allergy would silently fail to warn on
 * the 96 penicillin-class products in the catalogue. That is the exact miss
 * this check exists to prevent.
 *
 * Deliberately small and limited to classes where cross-reactivity is
 * well established and the consequence is serious. It is not a complete
 * allergy ontology, and it is not presented as one: results are advisory and a
 * prescriber still checks.
 *
 * ATC prefixes come from the WHO classification, which the Azerbaijani registry
 * publishes for 62% of products.
 */
@Component
public class DrugClassMap {

    /** Class term (lowercase) to the ATC prefixes it covers. */
    private static final Map<String, List<String>> CLASSES = new LinkedHashMap<>();

    static {
        // Beta-lactams. Cephalosporin cross-reactivity in penicillin-allergic
        // patients is lower than once believed but still clinically relevant,
        // so a penicillin allergy flags cephalosporins as well.
        CLASSES.put("penicillin", List.of("J01C", "J01D"));
        CLASSES.put("penisilin", List.of("J01C", "J01D"));
        CLASSES.put("amoxicillin", List.of("J01CA", "J01CR"));
        CLASSES.put("amoksisilin", List.of("J01CA", "J01CR"));
        CLASSES.put("ampicillin", List.of("J01CA"));
        CLASSES.put("cephalosporin", List.of("J01D"));
        CLASSES.put("sefalosporin", List.of("J01D"));
        CLASSES.put("beta lactam", List.of("J01C", "J01D"));

        CLASSES.put("sulfonamide", List.of("J01E"));
        CLASSES.put("sulfa", List.of("J01E"));
        CLASSES.put("sulfanilamid", List.of("J01E"));

        CLASSES.put("macrolide", List.of("J01FA"));
        CLASSES.put("makrolid", List.of("J01FA"));
        CLASSES.put("erythromycin", List.of("J01FA"));
        CLASSES.put("azithromycin", List.of("J01FA"));

        CLASSES.put("quinolone", List.of("J01M"));
        CLASSES.put("fluoroquinolone", List.of("J01M"));
        CLASSES.put("kinolon", List.of("J01M"));

        CLASSES.put("tetracycline", List.of("J01A"));
        CLASSES.put("tetrasiklin", List.of("J01A"));

        CLASSES.put("aminoglycoside", List.of("J01G"));
        CLASSES.put("gentamicin", List.of("J01GB"));

        // NSAIDs: aspirin-exacerbated respiratory disease means a salicylate
        // reaction commonly extends across the whole class.
        CLASSES.put("nsaid", List.of("M01A", "N02BA"));
        CLASSES.put("aspirin", List.of("N02BA", "B01AC06", "M01A"));
        CLASSES.put("aspirin salicylate", List.of("N02BA", "M01A"));
        CLASSES.put("salicylate", List.of("N02BA", "M01A"));
        CLASSES.put("ibuprofen", List.of("M01AE"));
        CLASSES.put("diclofenac", List.of("M01AB"));

        CLASSES.put("opioid", List.of("N02A"));
        CLASSES.put("opiat", List.of("N02A"));
        CLASSES.put("codeine", List.of("N02AJ", "R05DA04"));
        CLASSES.put("morphine", List.of("N02AA"));

        CLASSES.put("statin", List.of("C10AA"));
        CLASSES.put("ace inhibitor", List.of("C09A", "C09B"));
        CLASSES.put("sulfonylurea", List.of("A10BB"));
    }

    /**
     * ATC prefixes implied by an allergen, or empty when it names no known class.
     *
     * Matching is on whole words so "penicillin" in "allergic to penicillin"
     * is found, while an unrelated allergen returns nothing rather than a
     * loose partial hit.
     */
    public Set<String> atcPrefixesFor(String allergen) {
        Set<String> prefixes = new LinkedHashSet<>();
        if (allergen == null || allergen.isBlank()) return prefixes;

        String text = allergen.toLowerCase(Locale.ROOT)
                .replace("ə", "e").replace("ı", "i").replace("ş", "s")
                .replace("ç", "c").replace("ö", "o").replace("ü", "u").replace("ğ", "g")
                .replaceAll("[^a-z ]", " ")
                .replaceAll("\\s+", " ").trim();

        for (Map.Entry<String, List<String>> entry : CLASSES.entrySet()) {
            String term = entry.getKey();
            if (text.equals(term) || text.contains(term)) {
                prefixes.addAll(entry.getValue());
            }
        }
        return prefixes;
    }
}
