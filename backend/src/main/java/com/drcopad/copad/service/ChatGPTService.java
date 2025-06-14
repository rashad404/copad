package com.drcopad.copad.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.drcopad.copad.config.ChatGPTConfig;
import com.drcopad.copad.dto.ChatGPTRequest;
import com.drcopad.copad.dto.ChatGPTResponse;
import com.drcopad.copad.dto.Message;
import com.drcopad.copad.dto.MessageContent;
import com.drcopad.copad.entity.ChatMessage;
import com.drcopad.copad.entity.FileAttachment;
import com.drcopad.copad.entity.MedicalSpecialty;
import com.drcopad.copad.repository.MedicalSpecialtyRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatGPTService {

    private final WebClient webClient;
    private final ChatGPTConfig chatGPTConfig;
    private final ObjectMapper objectMapper;
    private final MedicalSpecialtyRepository specialtyRepository;
    private final LanguageMappingService languageMappingService;
    private final DocumentExtractionService documentExtractionService;
    
    @Value("${upload.public-url:http://localhost:8080}")
    private String publicUrl;
    
    @Value("${upload.base-dir:../public_html}")
    private String uploadBaseDir;

    public String getChatResponse(String newUserMessage, List<ChatMessage> history, String specialtyCode, String language) {
        return getChatResponse(newUserMessage, history, specialtyCode, language, null);
    }
    
    public String getChatResponse(String newUserMessage, List<ChatMessage> history, String specialtyCode, String language, List<FileAttachment> attachments) {
        List<Message> messages = new ArrayList<>();
        
        // Get specialty-specific prompt
        MedicalSpecialty specialty = specialtyRepository.findByCode(specialtyCode)
            .orElseThrow(() -> new IllegalArgumentException("Invalid specialty code: " + specialtyCode));
            
        // Add specialty-specific system prompt with language instruction
        String fullLanguageName = languageMappingService.getFullLanguageName(language);

        // Enhanced system prompt that handles files and images
        String systemPrompt = specialty.getSystemPrompt() +
            "\nYou are an AI doctor providing concise, practical medical information. Follow these guidelines:\n" +
            "1. Give direct, actionable advice without unnecessary introductions.\n" +
            "2. Use simple language and short sentences.\n" +
            "3. Format your responses as brief bullet points when possible.\n" +
            "4. Include this disclaimer with medical recommendations: \"These suggestions are not medical advice. Please consult your doctor.\"\n" +
            "5. Admit knowledge gaps directly without speculation.\n" +
            "6. Only share evidence-based information.\n" +
            "7. List common medication side effects briefly when relevant.\n" +
            "8. Never diagnose - describe potential conditions only.\n" +
            "9. Clearly flag emergency symptoms requiring immediate care.\n" +
            "10. Stay within your knowledge scope.\n" +
            "11. Prioritize the most effective solutions first.\n" +
            // "12. Avoid pleasantries and get straight to helpful information.\n" +
            // "13. Respond politely to greetings and expressions of thanks. For all other unrelated, inappropriate, or off-topic questions, politely refuse by saying: \"I'm an AI doctor. Please ask health-related questions only.\"\n" +
            // "14. If a user asks non-medical questions (e.g., about coding, finance, games, etc.), kindly remind them: \"I'm an AI doctor. Please ask health-related questions only.\"\n" +
            "15. For images that appear to show medical conditions, explain what you can observe but emphasize that a proper in-person medical evaluation is necessary.\n" +
            (fullLanguageName != null ? String.format("\nPlease respond in %s.", fullLanguageName) : "");

        // messages.add(new Message("system", systemPrompt));

        // Add message history
        // for (ChatMessage c : history) {
        //     String role = c.getSender().equalsIgnoreCase("USER") ? "user" : "assistant";
            
        //     // Regular text message
        //     if (c.getAttachments() == null || c.getAttachments().isEmpty()) {
        //         messages.add(new Message(role, c.getMessage()));
        //     } else {
        //         // Message with attachments - handle differently
        //         processMessageWithAttachments(messages, c, role);
        //     }
        // }

        // Process current message
        if (history.isEmpty() || !history.get(history.size() - 1).getMessage().equals(newUserMessage)) {
            // Only process the current user message if it's not already in history
            // (this prevents duplicate messages in the OpenAI request)
            
            // Check if we have attachments for the current message
            if (attachments != null && !attachments.isEmpty()) {
                // Create a temporary ChatMessage to process with attachments
                ChatMessage tempMessage = new ChatMessage();
                tempMessage.setMessage(newUserMessage);
                tempMessage.setSender("USER");
                tempMessage.setAttachments(attachments);
                processMessageWithAttachments(messages, tempMessage, "user");
            } else {
                // Regular text message
                messages.add(new Message("user", newUserMessage));
            }
        }

        return getChatGPTResponse(messages).block();
    }
    
    private void processMessageWithAttachments(List<Message> messages, ChatMessage chatMessage, String role) {
        if ("assistant".equals(role)) {
            // For assistant messages, we don't process attachments (AI doesn't send files)
            messages.add(new Message(role, chatMessage.getMessage()));
            return;
        }
        
        // Process user message with attachments
        boolean hasImageAttachments = chatMessage.getAttachments().stream()
                .anyMatch(attachment -> attachment.getFileType().startsWith("image/"));
        boolean hasDocumentAttachments = chatMessage.getAttachments().stream()
                .anyMatch(attachment -> !attachment.getFileType().startsWith("image/"));
                
        if (hasImageAttachments) {
            // Create a multimodal message with text and images
            List<MessageContent> contentObjects = new ArrayList<>();
            
            // Add text content if available
            if (chatMessage.getMessage() != null && !chatMessage.getMessage().trim().isEmpty()) {
                MessageContent textContent = new MessageContent();
                textContent.setType("text");
                textContent.setText(chatMessage.getMessage());
                contentObjects.add(textContent);
            }
            
            // Add images
            chatMessage.getAttachments().stream()
                    .filter(attachment -> attachment.getFileType().startsWith("image/"))
                    .forEach(image -> {
                        try {
                            MessageContent imageContent = new MessageContent();
                            imageContent.setType("image_url");
                            
                            if (publicUrl.contains("localhost") || publicUrl.contains("127.0.0.1")) {
                                // For localhost, use base64 encoding since OpenAI can't access localhost URLs
                                // Construct the full path to the image in public_html
                                Path imagePath = Paths.get(uploadBaseDir, image.getFilePath());
                                byte[] imageBytes = Files.readAllBytes(imagePath);
                                String base64Image = Base64.getEncoder().encodeToString(imageBytes);
                                
                                // Determine MIME type
                                String mimeType = image.getFileType();
                                if (mimeType == null || mimeType.isEmpty()) {
                                    mimeType = "image/jpeg"; // default
                                }
                                
                                String dataUrl = "data:" + mimeType + ";base64," + base64Image;
                                log.info("Using base64 encoded image for OpenAI (localhost environment)");
                                imageContent.setImage_url(new MessageContent.ImageUrl(dataUrl, "high"));
                            } else {
                                // For production, use the actual URL
                                String imageUrl = publicUrl + "/" + image.getFilePath();
                                log.info("Generated image URL for OpenAI: {}", imageUrl);
                                imageContent.setImage_url(new MessageContent.ImageUrl(imageUrl, "high"));
                            }
                            
                            contentObjects.add(imageContent);
                        } catch (IOException e) {
                            log.error("Failed to process image attachment: {}", image.getFilePath(), e);
                        }
                    });
            
            // Create multimodal message
            Message multimodalMessage = new Message();
            multimodalMessage.setRole(role);
            multimodalMessage.setContent(null); // Explicitly set content to null
            multimodalMessage.setContent_objects(contentObjects);
            messages.add(multimodalMessage);
            
        } else if (hasDocumentAttachments) {
            // For document attachments, extract text and append to message
            StringBuilder enhancedMessage = new StringBuilder();
            if (chatMessage.getMessage() != null && !chatMessage.getMessage().trim().isEmpty()) {
                enhancedMessage.append(chatMessage.getMessage()).append("\n\n");
            }
            
            enhancedMessage.append("--- Document Content ---\n");
            
            for (FileAttachment doc : chatMessage.getAttachments()) {
                if (!doc.getFileType().startsWith("image/")) {
                    // Construct the full path to the document in public_html
                    String fullPath = Paths.get(uploadBaseDir, doc.getFilePath()).toString();
                    String extractedText = documentExtractionService.extractTextFromDocument(
                        fullPath, doc.getFileType()
                    );
                    
                    if (extractedText != null && !extractedText.trim().isEmpty()) {
                        enhancedMessage.append("\nFile: ").append(doc.getOriginalFilename()).append("\n");
                        enhancedMessage.append(extractedText).append("\n");
                    } else {
                        enhancedMessage.append("\nFile: ").append(doc.getOriginalFilename())
                            .append(" (Could not extract text)\n");
                    }
                }
            }
            
            messages.add(new Message(role, enhancedMessage.toString()));
        } else {
            // No attachments, just include the text message
            messages.add(new Message(role, chatMessage.getMessage()));
        }
    }

    private Mono<String> getChatGPTResponse(List<Message> messages) {
        boolean useDummyData = chatGPTConfig.isUseDummyData();
        log.info("Injected config values — useDummyData={}, model={}, url={}", 
            chatGPTConfig.isUseDummyData(), 
            chatGPTConfig.getOpenai().getModel(), 
            chatGPTConfig.getOpenai().getUrl());
        
        if (useDummyData) {
            log.info("Using dummy response mode");
            return getDummyResponse(messages);
        }

        log.info("Using real ChatGPT API with config: model={}, url={}", 
            chatGPTConfig.getOpenai().getModel(), chatGPTConfig.getOpenai().getUrl());

        ChatGPTRequest request = ChatGPTRequest.builder()
                .model(chatGPTConfig.getOpenai().getModel())
                .messages(messages)
                .build();

        try {
            String requestJson = objectMapper.writeValueAsString(request);
            log.info("Sending request to ChatGPT API: {}", requestJson);
            // Log the first 1000 characters of each message content to debug
            request.getMessages().forEach(msg -> {
                if (msg.getContentForJson() instanceof List) {
                    log.info("Message role: {}, content type: List with {} items", msg.getRole(), ((List<?>) msg.getContentForJson()).size());
                } else if (msg.getContentForJson() instanceof String) {
                    String content = (String) msg.getContentForJson();
                    log.info("Message role: {}, content: {}", msg.getRole(), 
                        content.length() > 100 ? content.substring(0, 100) + "..." : content);
                }
            });
        } catch (Exception e) {
            log.error("Error serializing request", e);
        }

        return webClient.post()
                .uri(chatGPTConfig.getOpenai().getUrl())
                .header("Authorization", "Bearer " + chatGPTConfig.getOpenai().getKey())
                .header("Content-Type", "application/json")
                .bodyValue(request)
                .retrieve()
                .onStatus(status -> !status.is2xxSuccessful(),
                    response -> response.bodyToMono(String.class)
                        .flatMap(body -> {
                            log.error("OpenAI API error response: Status={}, Body={}", response.statusCode(), body);
                            return Mono.error(new RuntimeException("OpenAI API error: " + response.statusCode() + " - " + body));
                        }))
                .bodyToMono(ChatGPTResponse.class)
                .map(response -> {
                    log.info("Received response from ChatGPT API: {}", response);
                    if (response.getChoices() != null && !response.getChoices().isEmpty()) {
                        String content = response.getChoices().get(0).getMessage().getContent();
                        if (content != null) {
                            return content;
                        }
                        log.warn("Response content is null from OpenAI API");
                    }
                    return "I apologize, but I couldn't generate a response. Please try again.";
                })
                .onErrorResume(e -> {
                    log.error("Error calling ChatGPT API. Error details: {}", e.getMessage(), e);
                    if (e.getMessage() != null) {
                        log.error("Full error stack trace:", e);
                        // Check if it's a WebClientResponseException to get more details
                        if (e instanceof org.springframework.web.reactive.function.client.WebClientResponseException) {
                            org.springframework.web.reactive.function.client.WebClientResponseException responseException = 
                                (org.springframework.web.reactive.function.client.WebClientResponseException) e;
                            log.error("Response body: {}", responseException.getResponseBodyAsString());
                            log.error("Status code: {}", responseException.getStatusCode());
                        }
                    }
                    return Mono.just("I apologize, but I'm having trouble processing your request at the moment. Please try again later.");
                });
    }

    private Mono<String> getDummyResponse(List<Message> messages) {
        log.info("Using dummy response for messages: {}", messages);
        
        // Get the last user message
        String lastUserMessage = messages.stream()
                .filter(m -> "user".equals(m.getRole()))
                .reduce((first, second) -> second)
                .map(Message::getContent)
                .orElse("");

        // Simulate some processing time
        try {
            Thread.sleep(ThreadLocalRandom.current().nextInt(500, 1500));
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // Return a dummy response based on the user's message
        String dummyResponse = "This is a dummy response for testing purposes. User message was: " + lastUserMessage;
        return Mono.just(dummyResponse);
    }
}
