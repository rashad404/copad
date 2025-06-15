package com.drcopad.copad.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class VectorStoreService {
    
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate = new RestTemplate();
    
    @Value("${app.chatgpt.openai.key}")
    private String openaiApiKey;
    
    private static final String VECTOR_STORES_API = "https://api.openai.com/v1/vector_stores";
    private static final String VECTOR_STORE_FILES_API = "https://api.openai.com/v1/vector_stores/%s/files";
    
    /**
     * Create a new vector store
     */
    public String createVectorStore(String name, Map<String, Object> metadata) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(openaiApiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        Map<String, Object> body = new HashMap<>();
        body.put("name", name);
        if (metadata != null) {
            body.put("metadata", metadata);
        }
        
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                VECTOR_STORES_API, request, String.class
            );
            
            JsonNode jsonResponse = objectMapper.readTree(response.getBody());
            String vectorStoreId = jsonResponse.get("id").asText();
            
            log.info("Created vector store: {} with ID: {}", name, vectorStoreId);
            return vectorStoreId;
            
        } catch (Exception e) {
            log.error("Failed to create vector store: {}", name, e);
            throw new RuntimeException("Failed to create vector store", e);
        }
    }
    
    /**
     * Add a file to a vector store
     */
    public String addFileToVectorStore(String vectorStoreId, String fileId) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(openaiApiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        Map<String, Object> body = new HashMap<>();
        body.put("file_id", fileId);
        
        String url = String.format(VECTOR_STORE_FILES_API, vectorStoreId);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                url, request, String.class
            );
            
            JsonNode jsonResponse = objectMapper.readTree(response.getBody());
            String vectorFileId = jsonResponse.get("id").asText();
            
            log.info("Added file {} to vector store {}, vector file ID: {}", 
                fileId, vectorStoreId, vectorFileId);
            return vectorFileId;
            
        } catch (Exception e) {
            log.error("Failed to add file {} to vector store {}", fileId, vectorStoreId, e);
            throw new RuntimeException("Failed to add file to vector store", e);
        }
    }
    
    /**
     * Create a vector store and add multiple files
     */
    public String createVectorStoreWithFiles(String name, List<String> fileIds, 
                                             Map<String, Object> metadata) {
        // Create the vector store
        String vectorStoreId = createVectorStore(name, metadata);
        
        // Add files to the vector store
        for (String fileId : fileIds) {
            try {
                addFileToVectorStore(vectorStoreId, fileId);
            } catch (Exception e) {
                log.error("Failed to add file {} to vector store {}, continuing...", 
                    fileId, vectorStoreId, e);
            }
        }
        
        return vectorStoreId;
    }
    
    /**
     * Check vector store file processing status
     */
    public boolean isVectorStoreReady(String vectorStoreId) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(openaiApiKey);
        
        String url = VECTOR_STORES_API + "/" + vectorStoreId;
        HttpEntity<Void> request = new HttpEntity<>(headers);
        
        try {
            ResponseEntity<String> response = restTemplate.exchange(
                url, HttpMethod.GET, request, String.class
            );
            
            JsonNode jsonResponse = objectMapper.readTree(response.getBody());
            JsonNode fileCounts = jsonResponse.get("file_counts");
            
            int inProgress = fileCounts.get("in_progress").asInt();
            int completed = fileCounts.get("completed").asInt();
            int failed = fileCounts.get("failed").asInt();
            
            log.info("Vector store {} status - Completed: {}, In Progress: {}, Failed: {}", 
                vectorStoreId, completed, inProgress, failed);
            
            return inProgress == 0 && completed > 0;
            
        } catch (Exception e) {
            log.error("Failed to check vector store status: {}", vectorStoreId, e);
            return false;
        }
    }
}