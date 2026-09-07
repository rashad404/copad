package com.drcopad.copad.service;

import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

@Slf4j
@Service
public class DocumentExtractionService {
    
    private static final int MAX_TEXT_LENGTH = 4000; // Limit text to avoid token limits
    
    /**
     * Extracts text from bytes already read from private storage.
     *
     * The path-based method below reads from disk, which the document pipeline
     * cannot use: files live outside the web root under generated keys, and
     * only the storage service knows how to resolve one.
     *
     * No truncation here. The 4000-character cap on the other method exists to
     * fit a chat prompt; a stored document keeps its full text so lab values
     * further down the page are not silently lost.
     */
    public String extractText(byte[] bytes, String contentType) {
        if (bytes == null || bytes.length == 0 || contentType == null) return null;
        try {
            switch (contentType) {
                case "application/pdf" -> {
                    try (PDDocument document = PDDocument.load(bytes)) {
                        return new PDFTextStripper().getText(document);
                    }
                }
                case "application/vnd.openxmlformats-officedocument.wordprocessingml.document" -> {
                    try (XWPFDocument doc = new XWPFDocument(new java.io.ByteArrayInputStream(bytes));
                         XWPFWordExtractor extractor = new XWPFWordExtractor(doc)) {
                        return extractor.getText();
                    }
                }
                case "text/plain" -> {
                    return new String(bytes, java.nio.charset.StandardCharsets.UTF_8);
                }
                default -> {
                    // Images need OCR, which is not wired up yet; the document
                    // is stored and viewable, just not searchable.
                    return null;
                }
            }
        } catch (Exception e) {
            log.warn("Could not extract text ({}): {}", contentType, e.getClass().getSimpleName());
            return null;
        }
    }

    public String extractTextFromDocument(String filePath, String fileType) {
        try {
            File file = new File(filePath);
            if (!file.exists()) {
                log.error("File not found: {}", filePath);
                return null;
            }
            
            String extractedText = null;
            
            if (fileType.equals("application/pdf")) {
                extractedText = extractTextFromPDF(file);
            } else if (fileType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
                // .docx files
                extractedText = extractTextFromDocx(file);
            } else if (fileType.equals("application/msword")) {
                // .doc files
                extractedText = extractTextFromDoc(file);
            } else if (fileType.equals("text/plain")) {
                // .txt files
                extractedText = extractTextFromTxt(file);
            }
            
            // Limit the text length to avoid token limits
            if (extractedText != null && extractedText.length() > MAX_TEXT_LENGTH) {
                extractedText = extractedText.substring(0, MAX_TEXT_LENGTH) + "...(truncated)";
            }
            
            return extractedText;
            
        } catch (Exception e) {
            log.error("Error extracting text from document: {}", filePath, e);
            return null;
        }
    }
    
    private String extractTextFromPDF(File file) throws IOException {
        try (PDDocument document = PDDocument.load(file)) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }
    
    private String extractTextFromDocx(File file) throws IOException {
        try (FileInputStream fis = new FileInputStream(file);
             XWPFDocument document = new XWPFDocument(fis)) {
            XWPFWordExtractor extractor = new XWPFWordExtractor(document);
            return extractor.getText();
        }
    }
    
    private String extractTextFromDoc(File file) throws IOException {
        // For now, return a message that .doc files are not fully supported
        return "Note: .doc file format is not fully supported. Please use .docx or .pdf format for better results.";
    }
    
    private String extractTextFromTxt(File file) throws IOException {
        return new String(java.nio.file.Files.readAllBytes(file.toPath()));
    }
}