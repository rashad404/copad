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