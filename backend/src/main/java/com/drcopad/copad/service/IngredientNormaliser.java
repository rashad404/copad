package com.drcopad.copad.service;

import org.springframework.stereotype.Component;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

/**
 * Turns a catalogue ingredient string into comparable ingredient names.
 *
 * The registry publishes one free-text field per product, and it looks like:
 *
 *   "Ibuprofen - 200 mg/5 ml"
 *   "Amoxicillin trihydrate - 500 mg (eq. to Amoxicillin 500 mg)"
 *   "Lecithin (PC 35%) - 857.13 mg (eq. to Phosphatidylcholine - 300 mg),
 *    Thiamine mononitrate (vit B1) - 10 mg, ..."
 *
 * Matching an allergen against that raw text would miss almost every time, so
 * it is split on separators, stripped of dosage and parentheticals, and
 * reduced to a base name. "Amoxicillin trihydrate" becomes "amoxicillin", which
 * is what a person's allergy record actually says.
 */
@Component
public class IngredientNormaliser {

    /** Salt and hydrate forms that name the same drug for allergy purposes. */
    private static final List<String> SALT_SUFFIXES = List.of(
            "hydrochloride", "hydrobromide", "hydrate", "trihydrate", "dihydrate",
            "monohydrate", "sodium", "potassium", "calcium", "magnesium",
            "sulfate", "sulphate", "phosphate", "acetate", "citrate", "tartrate",
            "maleate", "mesylate", "besylate", "succinate", "fumarate",
            "nitrate", "mononitrate", "carbonate", "gluconate", "lactate",
            "oxide", "chloride", "bromide", "base", "anhydrous", "micronized",
            "micronised", "milled", "dihydrochloride"
    );

    /**
     * Splits a catalogue string into normalised ingredient names.
     * Returns an ordered, de-duplicated set.
     */
    public Set<String> parse(String raw) {
        Set<String> result = new LinkedHashSet<>();
        if (raw == null || raw.isBlank()) return result;

        // Products list ingredients separated by commas or semicolons, and
        // multi-strength products repeat the whole list per strength.
        for (String part : raw.split("[,;]")) {
            String name = normalise(part);
            // A real ingredient name is short. Anything longer is a fragment the
            // parser could not reduce - usually a description that happens to
            // contain no separator - and it would never match an allergen, so
            // it is dropped rather than stored and silently truncated.
            if (!name.isBlank() && name.length() > 2 && name.length() <= 120) {
                result.add(name);
            }
        }
        return result;
    }

    /** Reduces one fragment to a base ingredient name, or "" if nothing usable. */
    public String normalise(String fragment) {
        if (fragment == null) return "";

        String s = fragment.toLowerCase(Locale.ROOT);

        // Everything after a dash is dosage: "Ibuprofen - 200 mg/5 ml".
        int dash = s.indexOf(" - ");
        if (dash > 0) s = s.substring(0, dash);

        // Parentheticals are equivalences and vitamin labels, not the name.
        s = s.replaceAll("\\([^)]*\\)", " ");

        // Any remaining quantity.
        s = s.replaceAll("\\d+([.,]\\d+)?\\s*(mg|ml|g|mcg|µg|iu|ie|%|kg|l)\\b", " ");
        s = s.replaceAll("\\b\\d+([.,]\\d+)?\\b", " ");

        // Accents fold so "Ibuprofén" and "Ibuprofen" compare equal; Azerbaijani
        // letters that do not decompose are mapped explicitly.
        s = s.replace("ə", "e").replace("ı", "i").replace("ğ", "g")
             .replace("ş", "s").replace("ç", "c").replace("ö", "o").replace("ü", "u");
        s = Normalizer.normalize(s, Normalizer.Form.NFD).replaceAll("\\p{M}", "");

        s = s.replaceAll("[^a-z ]", " ").replaceAll("\\s+", " ").trim();

        // Drop trailing salt or hydrate words; the base name is what an allergy
        // record holds.
        List<String> words = new ArrayList<>(List.of(s.split(" ")));
        while (words.size() > 1 && SALT_SUFFIXES.contains(words.get(words.size() - 1))) {
            words.remove(words.size() - 1);
        }
        return String.join(" ", words).trim();
    }

    /**
     * Whether an allergen names this ingredient.
     *
     * Word-boundary containment in either direction, so "penicillin" matches
     * "phenoxymethylpenicillin" and "amoxicillin trihydrate" matches
     * "amoxicillin". Deliberately generous: a missed drug allergy is far more
     * costly than an extra warning, and the result is advisory rather than a
     * block.
     */
    public boolean matches(String allergen, String ingredientNormalised) {
        String a = normalise(allergen);
        if (a.isBlank() || ingredientNormalised == null || ingredientNormalised.isBlank()) {
            return false;
        }
        if (a.equals(ingredientNormalised)) return true;
        // Short fragments would match far too much.
        if (a.length() < 5) return false;
        return ingredientNormalised.contains(a) || a.contains(ingredientNormalised);
    }
}
