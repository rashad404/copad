package com.drcopad.copad.service;

/**
 * Replaces typographic punctuation with the plain ASCII equivalent.
 *
 * The system prompt asks the model for plain punctuation and the model mostly
 * complies, which is not the same as complying. An en dash in one reply out of
 * five is exactly the machine-written look the rule exists to avoid, so the
 * guarantee is made here rather than requested there.
 *
 * Azerbaijani letters are content and are never touched; this is about
 * typography only.
 */
final class PlainPunctuation {

    private PlainPunctuation() {
    }

    static String apply(String text) {
        if (text == null || text.isEmpty()) return text;

        StringBuilder out = new StringBuilder(text.length());
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            switch (c) {
                // Dashes and minus signs.
                case '‐', '‑', '‒', '–', '—', '―', '−' ->
                        out.append('-');
                // Quotes, including the low ones and the guillemets that turn up
                // in Azerbaijani and Russian text.
                case '‘', '’', '‚', '‛', '′' -> out.append('\'');
                case '“', '”', '„', '‟', '″',
                     '«', '»' -> out.append('"');
                case '…' -> out.append("...");
                // Spaces that are not spaces: non-breaking, narrow, thin.
                case ' ', ' ', ' ', ' ' -> out.append(' ');
                case '•', '‣', '◦' -> out.append('-');
                default -> out.append(c);
            }
        }
        return out.toString();
    }
}
