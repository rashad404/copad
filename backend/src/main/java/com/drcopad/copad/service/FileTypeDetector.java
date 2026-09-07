package com.drcopad.copad.service;

import java.util.Locale;

/**
 * Identifies a file from its leading bytes.
 *
 * The declared content type is whatever the client chose to send, so a script
 * can arrive labelled as a PDF. Every upload path decides what it will accept
 * from this, not from the header.
 */
final class FileTypeDetector {

    private FileTypeDetector() {
    }

    static String detect(byte[] bytes, String filename) {
        if (bytes.length >= 4) {
            if (bytes[0] == 0x25 && bytes[1] == 0x50 && bytes[2] == 0x44 && bytes[3] == 0x46) {
                return "application/pdf";
            }
            if ((bytes[0] & 0xFF) == 0xFF && (bytes[1] & 0xFF) == 0xD8) return "image/jpeg";
            if ((bytes[0] & 0xFF) == 0x89 && bytes[1] == 0x50 && bytes[2] == 0x4E) return "image/png";
            if (bytes[0] == 0x50 && bytes[1] == 0x4B) {
                // A zip container: docx, or something pretending to be one.
                return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            }
            if (bytes[0] == 0x49 && bytes[1] == 0x49) return "image/tiff";
            if (bytes[0] == 0x4D && bytes[1] == 0x4D) return "image/tiff";
        }
        if (bytes.length >= 12) {
            String riff = new String(bytes, 0, 4);
            String webp = new String(bytes, 8, 4);
            if ("RIFF".equals(riff) && "WEBP".equals(webp)) return "image/webp";
            if ("ftyp".equals(new String(bytes, 4, 4))) return "image/heic";
        }
        // Only for plain text, which has no magic bytes to check.
        if (filename != null && filename.toLowerCase(Locale.ROOT).endsWith(".txt")) {
            return "text/plain";
        }
        return "application/octet-stream";
    }
}
