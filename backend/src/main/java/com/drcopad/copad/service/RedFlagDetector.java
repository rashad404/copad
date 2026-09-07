package com.drcopad.copad.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;

/**
 * Symptoms that must not wait for a considered answer.
 *
 * Urgency is currently a line in the system prompt, which means it depends on
 * the model noticing. For a description of crushing chest pain or one-sided
 * weakness that is not good enough: those are the cases where a careful,
 * balanced reply is the wrong reply.
 *
 * This errs towards firing. Missing a heart attack is catastrophic and a
 * needless "this could be urgent" is an annoyance - but only up to a point,
 * because a warning that fires on everything is one people learn to skip. So
 * the patterns are specific phrases rather than single words: "sinəmdə ağrı"
 * fires, "ağrı" does not.
 *
 * It detects; it does not diagnose. The output tells the assistant what was
 * seen and to lead with it.
 */
@Slf4j
@Service
public class RedFlagDetector {

    /** Azerbaijan's ambulance number, and the unified emergency line. */
    public static final String EMERGENCY_NUMBERS = "103 (or 112)";

    public record RedFlag(String category, String guidance) {
    }

    /**
     * Written across Azerbaijani, Russian and English, and tolerant of missing
     * diacritics, because people type without them.
     */
    private record Rule(String category, String guidance, List<Pattern> patterns) {
    }

    private static Pattern p(String regex) {
        return Pattern.compile(regex,
                Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CHARACTER_CLASS);
    }

    private static final List<Rule> RULES = List.of(
            new Rule("possible heart attack",
                    "Chest pain with these features can be a heart attack.",
                    List.of(
                            p("sin[əe](?:m|md[əe]|sind[əe])?\\s*(?:\\w+\\s+){0,2}a[ğg]r[ıi]"),
                            p("k[üu]r[əe]k\\s*qafas[ıi]\\s*a[ğg]r"),
                            p("chest\\s+(?:pain|pressure|tightness)"),
                            p("боль\\s+в\\s+груди|давит\\s+в\\s+груди"),
                            p("(?:pain|a[ğg]r[ıi]).{0,30}(?:sol\\s*qol|left\\s+arm|jaw|[çc][əe]n[əe])"))),

            new Rule("possible stroke",
                    "Sudden one-sided weakness, facial droop or speech trouble can be a "
                            + "stroke, where the time to treatment decides the outcome.",
                    List.of(
                            p("(?:bir\\s*t[əe]r[əe]f|yar[ıi]m).{0,20}(?:keyi|iflic|g[üu]cs[üu]z|tutmur)"),
                            p("(?:[üu]z[üu]m|a[ğg]z[ıi]m).{0,15}(?:[əe]yil|[çc][əe]yril|droop)"),
                            p("dan[ıi][şs][ıi][ğg][ıi]m?\\s*(?:pozul|qar[ıi][şs])|bird[əe]n\\s*dan[ıi][şs]a\\s*bilm"),
                            p("(?:sudden|bird[əe]n|внезапн).{0,25}(?:numbness|weakness|keyim)"),
                            p("face\\s+droop|slurred\\s+speech|one\\s+side.{0,15}(?:weak|numb)"),
                            p("инсульт|перекосило\\s+лицо|онемела\\s+(?:рука|нога)"))),

            new Rule("trouble breathing",
                    "Breathing difficulty that came on quickly needs to be seen now.",
                    List.of(
                            p("n[əe]f[əe]s\\s*(?:ala\\s*bilm|dar[ıi]|[çc][əe]tin|tutulur)"),
                            p("bo[ğg]ulur|bo[ğg]uluram"),
                            p("(?:cannot|can'?t|unable\\s+to)\\s+breathe|struggling\\s+to\\s+breathe"),
                            p("(?:не\\s+могу|тяжело)\\s+дыш|задыха"))),

            new Rule("possible severe allergic reaction",
                    "Swelling of the face, lips, tongue or throat with an allergy can close "
                            + "the airway within minutes.",
                    List.of(
                            p("(?:dodaq|dil|boğaz|[üu]z).{0,20}(?:[şs]i[şs]|[őo]d[əe]m)"),
                            p("(?:throat|tongue|lip|face).{0,15}swell"),
                            p("anafilak|anaphyla"),
                            p("отек\\s+(?:горла|языка|лица|губ)"))),

            new Rule("heavy bleeding",
                    "Bleeding that will not stop needs emergency care.",
                    List.of(
                            p("qan\\s*(?:axmas[ıi]|itkisi)\\s*(?:dayanm|kesilm)"),
                            p("(?:bleeding|blood).{0,20}(?:won'?t\\s+stop|will\\s+not\\s+stop|heavily)"),
                            p("кровотечение\\s+не\\s+останав|сильное\\s+кровотечение"),
                            p("qan\\s*qusma|vomiting\\s+blood|рвота\\s+кровью"))),

            new Rule("thoughts of suicide",
                    "The person may be at risk of harming themselves. Respond with care, "
                            + "stay with the subject, and give a way to reach help now.",
                    List.of(
                            p("intihar|[őo]z[üu]m[üu]\\s*[őo]ld[üu]rm[əe]k"),
                            p("kill\\s+myself|end\\s+my\\s+life|suicid"),
                            p("(?:покончить\\s+с\\s+собой|суицид|убить\\s+себя)"),
                            p("ya[şs]amaq\\s*ist[əe]mir[əe]m|don'?t\\s+want\\s+to\\s+live"))),

            new Rule("possible meningitis",
                    "Fever with a stiff neck, or a rash that does not fade under pressure, "
                            + "can be meningitis.",
                    List.of(
                            p("(?:hərar[əe]t|temperatur|f?ever).{0,40}(?:boyun.{0,10}(?:sərt|tutul)|stiff\\s+neck)"),
                            p("stiff\\s+neck.{0,40}(?:fever|rash)"),
                            p("менингит|ригидность\\s+затылоч"))),

            new Rule("fever in a very young baby",
                    "A fever in an infant under three months is treated as an emergency "
                            + "regardless of how well the baby seems.",
                    List.of(
                            p("(?:\\b[0-2]\\s*(?:ayl[ıi]q|month).{0,30}(?:h[əe]rar[əe]t|temperatur|fever))"),
                            p("(?:yenido[ğg]|newborn|новорожд).{0,30}(?:h[əe]rar[əe]t|fever|температур)"))));

    /**
     * Words that turn a mention into its opposite.
     *
     * Only the plain forms. Reliable negation detection is a research problem,
     * and the cost of missing one here is a warning that should not have fired,
     * which is the direction to err in.
     */
    /**
     * Words that turn a mention into its opposite.
     *
     * Only the plain forms, and only close by. Reliable negation detection is a
     * research problem, and the cost of missing one here is a warning that
     * should not have fired - which is the direction to err in.
     */
    private static final Pattern NEGATION = Pattern.compile(
            "\\b(yox(?:dur)?|deyil(?:[əe]m)?|olmay[ıi]b|yoxdu|"
                    + "no|not|never|without|denies|"
                    + "н[еи]т|не|без)\\b",
            Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CHARACTER_CLASS);

    /** How far from the match a negation still applies to it. */
    private static final int NEGATION_WINDOW = 25;

    /**
     * Whether a negation sits close enough to cancel the match.
     *
     * Both sides, because the languages disagree about where it goes: English
     * puts it before ("no chest pain"), Azerbaijani after ("sinemde agri
     * yoxdur"). The window stops at sentence boundaries so a denial in one
     * sentence does not silence a symptom in the next.
     */
    private boolean negated(String message, int start, int end) {
        int from = Math.max(0, start - NEGATION_WINDOW);
        int to = Math.min(message.length(), end + NEGATION_WINDOW);

        String before = message.substring(from, start);
        String after = message.substring(end, to);

        // A sentence break ends the reach of a negation in either direction.
        int lastBreak = lastIndexOfAny(before, ".!?;\n");
        if (lastBreak >= 0) before = before.substring(lastBreak + 1);
        int nextBreak = firstIndexOfAny(after, ".!?;\n");
        if (nextBreak >= 0) after = after.substring(0, nextBreak);

        return NEGATION.matcher(before).find() || NEGATION.matcher(after).find();
    }

    private int lastIndexOfAny(String text, String chars) {
        for (int i = text.length() - 1; i >= 0; i--) {
            if (chars.indexOf(text.charAt(i)) >= 0) return i;
        }
        return -1;
    }

    private int firstIndexOfAny(String text, String chars) {
        for (int i = 0; i < text.length(); i++) {
            if (chars.indexOf(text.charAt(i)) >= 0) return i;
        }
        return -1;
    }

    /** What was seen, or empty. */
    public List<RedFlag> detect(String message) {
        if (message == null || message.isBlank()) return List.of();

        List<RedFlag> flags = new ArrayList<>();
        for (Rule rule : RULES) {
            for (Pattern pattern : rule.patterns()) {
                var matcher = pattern.matcher(message);
                if (matcher.find() && !negated(message, matcher.start(), matcher.end())) {
                    flags.add(new RedFlag(rule.category(), rule.guidance()));
                    break;
                }
            }
        }
        return flags;
    }

    /**
     * The instruction added to the system prompt.
     *
     * Empty for almost every message. When it is not empty it is the most
     * important thing in the prompt, so it says what was seen rather than
     * asking the model to work it out again.
     */
    public String contextFor(String message) {
        List<RedFlag> flags = detect(message);
        if (flags.isEmpty()) return "";

        log.info("Red flags in message: {}",
                flags.stream().map(RedFlag::category).toList());

        StringBuilder block = new StringBuilder("""

                URGENT - this overrides the instructions above.

                The message describes something that may need emergency care:
                """);
        for (RedFlag flag : flags) {
            block.append("- ").append(flag.category()).append(". ")
                    .append(flag.guidance()).append("\n");
        }
        block.append("\nBegin your reply with this, before anything else. Say plainly what to do")
                .append(" now and give the emergency number ").append(EMERGENCY_NUMBERS).append(".\n")
                .append("Do not open with reassurance, a list of possible causes, or questions.")
                .append(" Ask nothing until you have said it. Then, briefly, you may add what to")
                .append(" do while waiting. Be direct and calm, not alarming, and do not pad it")
                .append(" with caveats.\n");

        return block.toString();
    }
}
