package com.drcopad.copad.service;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import com.drcopad.copad.config.OpenAIResponsesConfig;
import com.drcopad.copad.dto.ResponsesAPIRequest;
import com.drcopad.copad.dto.ResponsesAPIResponse;
import com.drcopad.copad.entity.Chat;
import com.drcopad.copad.entity.ChatMessage;
import com.drcopad.copad.entity.FileAttachment;
import com.drcopad.copad.entity.GuestSession;
import com.drcopad.copad.entity.MedicalSpecialty;
import com.drcopad.copad.entity.User;
import com.drcopad.copad.entity.responses.Conversation;
import com.drcopad.copad.entity.responses.ConversationFile;
import com.drcopad.copad.entity.responses.OpenAIResponse;
import com.drcopad.copad.entity.responses.UsageMetric;
import com.drcopad.copad.exception.ConversationExpiredException;
import com.drcopad.copad.exception.CostLimitExceededException;
import com.drcopad.copad.repository.ChatRepository;
import com.drcopad.copad.repository.FileAttachmentRepository;
import com.drcopad.copad.repository.MedicalSpecialtyRepository;
import com.drcopad.copad.repository.MessageRepository;
import com.drcopad.copad.repository.responses.ConversationFileRepository;
import com.drcopad.copad.repository.responses.ConversationRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

import org.springframework.beans.factory.annotation.Value;

@Slf4j
@Service
public class OpenAIResponsesService {
    private final WebClient webClient;
    private final OpenAIResponsesConfig responsesConfig;
    private final ConversationManager conversationManager;
    private final CostCalculationService costCalculationService;
    private final MedicalSpecialtyRepository specialtyRepository;
    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final ConversationFileRepository conversationFileRepository;
    private final FileAttachmentRepository fileAttachmentRepository;
    private final FileUploadService fileUploadService;
    private final ObjectMapper objectMapper;
    private final ChatGPTService chatGPTService;
    
    @Value("${upload.public-url:http://localhost:8080}")
    private String publicUrl;

    public OpenAIResponsesService(WebClient webClient,
                                  @Qualifier("openAIResponsesConfig") OpenAIResponsesConfig responsesConfig,
                                  ConversationManager conversationManager,
                                  CostCalculationService costCalculationService,
                                  MedicalSpecialtyRepository specialtyRepository,
                                  ChatRepository chatRepository,
                                  MessageRepository messageRepository,
                                  ConversationRepository conversationRepository,
                                  ConversationFileRepository conversationFileRepository,
                                  FileAttachmentRepository fileAttachmentRepository,
                                  FileUploadService fileUploadService,
                                  ObjectMapper objectMapper,
                                  ChatGPTService chatGPTService) {
        this.webClient = webClient;
        this.responsesConfig = responsesConfig;
        this.conversationManager = conversationManager;
        this.costCalculationService = costCalculationService;
        this.specialtyRepository = specialtyRepository;
        this.chatRepository = chatRepository;
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
        this.conversationFileRepository = conversationFileRepository;
        this.fileAttachmentRepository = fileAttachmentRepository;
        this.fileUploadService = fileUploadService;
        this.objectMapper = objectMapper;
        this.chatGPTService = chatGPTService;
    }

    @CircuitBreaker(name = "openai-responses", fallbackMethod = "fallbackToChatGPT")
    @Retry(name = "openai-responses")
    @RateLimiter(name = "openai-responses")
    @Transactional
    public String getResponsesAPIResponse(String newUserMessage, List<ChatMessage> history,
                                          String specialtyCode, String language,
                                          List<FileAttachment> attachments,
                                          String chatId, User user, GuestSession guestSession) {

        if (!responsesConfig.isEnabled()) {
            log.info("Responses API is disabled, falling back to ChatGPT API");
            return chatGPTService.getChatResponse(newUserMessage, history, specialtyCode, language, attachments);
        }

        if (user != null && costCalculationService.hasExceededDailyLimit(user.getId())) {
            throw new CostLimitExceededException("Daily cost limit exceeded");
        }
        if (guestSession != null && costCalculationService.hasGuestExceededDailyLimit(guestSession.getId())) {
            throw new CostLimitExceededException("Daily token limit exceeded for guest session");
        }

        Conversation conversation = conversationManager.getOrCreateConversation(
            chatId, user, guestSession, specialtyCode, language
        );
        
        log.info("Created/Retrieved conversation with ID: {}", conversation.getConversationId());

        if (conversation.isExpired()) {
            throw new ConversationExpiredException("Conversation has expired. Please start a new conversation.");
        }

        MedicalSpecialty specialty = specialtyRepository.findByCode(specialtyCode)
            .orElseThrow(() -> new IllegalArgumentException("Invalid specialty code: " + specialtyCode));

        List<String> fileIds = new ArrayList<>();
        if (attachments != null && !attachments.isEmpty()) {
            log.info("Processing {} attachments for conversation {}", 
                attachments.size(), conversation.getConversationId());
            fileIds = processFileAttachments(attachments, conversation);
            log.info("Processed attachments, got {} OpenAI file IDs", fileIds.size());
        } else {
            log.info("No attachments to process for conversation {}", conversation.getConversationId());
        }

        ResponsesAPIRequest request = buildRequest(
            newUserMessage,
            conversation,
            specialty.getSystemPrompt(),
            language,
            fileIds,
            attachments
        );

        Instant startTime = Instant.now();

        try {
            ResponsesAPIResponse apiResponse = executeAPICall(request, conversation, startTime)
                .doOnError(error -> log.error("Error in executeAPICall", error))
                .block(Duration.ofSeconds(45));
            
            if (apiResponse == null) {
                log.error("Received null response from API call");
                throw new RuntimeException("No response received from OpenAI API");
            }
            
            log.info("Successfully received response from OpenAI API, processing it");
            String result = processResponse(apiResponse, conversation, request, startTime);
            
            if (result == null) {
                log.error("Processed response returned null");
                throw new RuntimeException("Failed to process OpenAI API response");
            }
            
            return result;
        } catch (Exception e) {
            log.error("Exception caught while executing API call", e);
            throw new RuntimeException("Failed to execute OpenAI Responses API call", e);
        }
    }

    private ResponsesAPIRequest buildRequest(String userMessage, Conversation conversation,
                                             String systemPrompt, String language, List<String> fileIds,
                                             List<FileAttachment> attachments) {

        String previousResponseId = conversationManager.getLastResponseId(conversation.getConversationId())
            .orElse(null);

        List<Map<String, Object>> tools = new ArrayList<>();
        // Temporarily disable file search until we implement vector store creation
        // The Responses API requires vector stores for file search, not direct file_ids
        /*
        if (responsesConfig.getTools().isFileSearch() && !fileIds.isEmpty()) {
            // TODO: Create vector store with the uploaded files
            // For now, we'll skip file search functionality
            log.warn("File search requested but vector store creation not implemented yet");
        }
        */
        if (responsesConfig.getTools().isWebSearch()) {
            Map<String, Object> webSearch = new HashMap<>();
            webSearch.put("type", "web_search_preview");
            tools.add(webSearch);
        }
        if (responsesConfig.getTools().isCodeInterpreter()) {
            Map<String, Object> codeInterpreter = new HashMap<>();
            codeInterpreter.put("type", "code_interpreter");
        
            Map<String, Object> container = new HashMap<>();
            container.put("type", "auto"); // per official doc :contentReference[oaicite:4]{index=4}
        
            codeInterpreter.put("container", container);
            tools.add(codeInterpreter);
        }
        

        // Use the same enhanced system prompt as ChatGPTService
        String fullSystemPrompt = systemPrompt +
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
            "12. When you receive images, describe what you can observe in them.\n" +
            "13. For images that appear to show medical conditions, explain what you can observe but emphasize that a proper in-person medical evaluation is necessary.\n" +
            "\nPlease respond in " + language + ".";
        
        // Build input - either simple string or multimodal array
        Object input;
        List<FileAttachment> imageAttachments = new ArrayList<>();
        List<FileAttachment> documentAttachments = new ArrayList<>();
        
        if (attachments != null && !attachments.isEmpty()) {
            log.info("Processing {} attachments for multimodal input", attachments.size());
            
            // Separate images and documents
            for (FileAttachment att : attachments) {
                log.debug("Processing attachment: {} (type: {}, openaiFileId: {})", 
                    att.getOriginalFilename(), att.getFileType(), att.getOpenaiFileId());
                    
                if (att.getFileType() != null && att.getFileType().startsWith("image/")) {
                    imageAttachments.add(att);
                } else {
                    documentAttachments.add(att);
                }
            }
            
            log.info("Found {} image attachments and {} document attachments", 
                imageAttachments.size(), documentAttachments.size());
        }
            
        if (imageAttachments.isEmpty() && documentAttachments.isEmpty()) {
            // Simple text input
            log.info("No attachments found, using simple text input");
            input = userMessage;
        } else {
            // Multimodal input with images and/or documents
            log.info("Building multimodal input with {} images and {} documents", 
                imageAttachments.size(), documentAttachments.size());
            List<Map<String, Object>> inputArray = new ArrayList<>();
            
            Map<String, Object> userInput = new HashMap<>();
            userInput.put("role", "user");
            
            List<Map<String, Object>> content = new ArrayList<>();
            
            // Add text part
            Map<String, Object> textPart = new HashMap<>();
            textPart.put("type", "input_text");
            textPart.put("text", userMessage);
            content.add(textPart);
            
            // Add document parts using file IDs
            for (FileAttachment doc : documentAttachments) {
                if (doc.getOpenaiFileId() != null) {
                    Map<String, Object> filePart = new HashMap<>();
                    filePart.put("type", "input_file");
                    filePart.put("file_id", doc.getOpenaiFileId());
                    content.add(filePart);
                    
                    log.info("Added document with file_id: {} for file: {}", 
                        doc.getOpenaiFileId(), doc.getOriginalFilename());
                } else {
                    log.warn("Document {} has no OpenAI file ID, skipping", doc.getOriginalFilename());
                }
            }
            
            // Add image parts using URLs
            for (FileAttachment image : imageAttachments) {
                Map<String, Object> imagePart = new HashMap<>();
                imagePart.put("type", "image_url");
                
                Map<String, Object> imageUrlObj = new HashMap<>();
                String imageUrl = publicUrl + "/" + image.getFilePath();
                imageUrlObj.put("url", imageUrl);
                
                imagePart.put("image_url", imageUrlObj);
                content.add(imagePart);
                
                log.info("Added image with URL: {} for file: {}", 
                    imageUrl, image.getOriginalFilename());
            }
            
            userInput.put("content", content);
            inputArray.add(userInput);
            
            input = inputArray;
        }

        // Determine user ID for the request
        String userId;
        if (conversation.getUser() != null) {
            userId = "user_" + conversation.getUser().getId();
        } else if (conversation.getGuestSession() != null) {
            userId = "guest_" + conversation.getGuestSession().getId();
        } else {
            userId = "chat_" + conversation.getChatId();
        }
        
        // Set store=true for initial turn (when there's no previous response)
        boolean shouldStore = previousResponseId == null;
        
        return ResponsesAPIRequest.builder()
            .model(conversation.getModel())
            .input(input)
            .instructions(fullSystemPrompt)
            .previousResponseId(previousResponseId)
            .tools(tools.isEmpty() ? null : tools)
            .toolChoice(tools.isEmpty() ? null : "auto")
            .temperature(0.7)
            .maxOutputTokens(2000)
            .user(userId)
            .store(shouldStore)
            .build();
    }

    private List<String> processFileAttachments(List<FileAttachment> attachments, Conversation conversation) {
        List<String> openaiFileIds = new ArrayList<>();
        for (FileAttachment attachment : attachments) {
            try {
                if (attachment.getOpenaiFileId() != null) {
                    openaiFileIds.add(attachment.getOpenaiFileId());
                    continue;
                }
                String openaiFileId = fileUploadService.uploadToOpenAI(attachment);
                attachment.setOpenaiFileId(openaiFileId);
                ConversationFile convFile = ConversationFile.builder()
                    .conversationId(conversation.getConversationId())
                    .fileAttachment(attachment)
                    .openaiFileId(openaiFileId)
                    .category(determineFileCategory(attachment))
                    .status("processed")
                    .build();
                conversationFileRepository.save(convFile);
                openaiFileIds.add(openaiFileId);
            } catch (Exception e) {
                log.error("Failed to process file attachment: {}", attachment.getOriginalFilename(), e);
            }
        }
        return openaiFileIds;
    }

    private String determineFileCategory(FileAttachment attachment) {
        String fileType = attachment.getFileType().toLowerCase();
        String filename = attachment.getOriginalFilename().toLowerCase();
        if (filename.contains("lab") || filename.contains("test") || filename.contains("result")) {
            return "lab-results";
        } else if (filename.contains("prescription") || filename.contains("rx")) {
            return "prescriptions";
        } else if (fileType.contains("dicom") || filename.matches(".*(xray|mri|ct|scan).*")) {
            return "imaging";
        } else if (filename.contains("note") || filename.contains("report") || filename.contains("summary")) {
            return "clinical-notes";
        }
        return "general";
    }

    private Mono<ResponsesAPIResponse> executeAPICall(ResponsesAPIRequest request, Conversation conversation, Instant startTime) {
        // Log the complete request payload
        try {
            String requestJson = objectMapper.writeValueAsString(request);
            log.info("OpenAI Responses API Request URL: {}", responsesConfig.getUrl());
            log.info("OpenAI Responses API Request Payload: {}", requestJson);
        } catch (Exception e) {
            log.error("Failed to serialize request for logging", e);
        }
        
        return webClient.post()
            .uri(responsesConfig.getUrl())
            .header("Authorization", "Bearer " + chatGPTService.getChatGPTConfig().getOpenai().getKey())
            .bodyValue(request)
            .retrieve()
            .onStatus(status -> !status.is2xxSuccessful(),
                resp -> resp.bodyToMono(String.class)
                    .defaultIfEmpty("No response body")
                    .flatMap(body -> {
                        log.error("OpenAI Responses API error: Status={}, Body={}", resp.statusCode(), body);
                        return Mono.error(new RuntimeException("OpenAI API error: " + resp.statusCode() + " - " + body));
                    }))
            .bodyToMono(ResponsesAPIResponse.class)
            .doOnNext(resp -> {
                log.info("Received response from OpenAI API: {}", resp.getId());
                try {
                    log.debug("Full response object: {}", objectMapper.writeValueAsString(resp));
                } catch (Exception e) {
                    log.debug("Could not serialize response for logging", e);
                }
            })
            .doOnSuccess(result -> log.info("Successfully completed API call"))
            .doOnError(error -> log.error("Error calling OpenAI Responses API", error));
    }

    private String extractTextFromObject(Object obj) {
        if (obj == null) {
            return null;
        }
        
        // If it's already a string, return it
        if (obj instanceof String) {
            return (String) obj;
        }
        
        // If it's a Map, look for text or content fields
        if (obj instanceof Map) {
            Map<?, ?> map = (Map<?, ?>) obj;
            Object text = map.get("text");
            if (text != null) {
                return extractTextFromObject(text);
            }
            Object content = map.get("content");
            if (content != null) {
                return extractTextFromObject(content);
            }
        }
        
        // If it's a List/Array, join the text elements
        if (obj instanceof List) {
            List<?> list = (List<?>) obj;
            return list.stream()
                .map(item -> {
                    if (item instanceof Map) {
                        Map<?, ?> itemMap = (Map<?, ?>) item;
                        Object type = itemMap.get("type");
                        if ("text".equals(type) || "input_text".equals(type)) {
                            Object text = itemMap.get("text");
                            return text != null ? text.toString() : null;
                        }
                    }
                    return extractTextFromObject(item);
                })
                .filter(text -> text != null && !text.isEmpty())
                .collect(Collectors.joining("\n"));
        }
        
        // Default: convert to string
        return obj.toString();
    }
    
    private String processResponse(ResponsesAPIResponse response, Conversation conversation,
                                   ResponsesAPIRequest request, Instant startTime) {
        long responseTimeMs = Duration.between(startTime, Instant.now()).toMillis();
        String textContent = response.getOutputText();
        if (textContent == null && response.getOutput() != null) {
            // Try to extract text from various output types and fields
            textContent = response.getOutput().stream()
                .map(o -> {
                    // Try different fields that might contain text
                    if (o.getText() != null) {
                        return o.getText();
                    }
                    if (o.getContent() != null) {
                        return extractTextFromObject(o.getContent());
                    }
                    if (o.getMessage() != null) {
                        return extractTextFromObject(o.getMessage());
                    }
                    log.debug("Could not extract text from output: type={}, id={}", o.getType(), o.getId());
                    return null;
                })
                .filter(text -> text != null && !text.isEmpty())
                .collect(Collectors.joining("\n"));
        }
        
        // Ensure we have content to return
        if (textContent == null || textContent.isEmpty()) {
            log.error("No text content in OpenAI response: {}", response);
            textContent = "I apologize, but I couldn't generate a response. Please try again.";
        }
        
        log.info("Extracted text content from response: {} characters", textContent.length());
        Chat chat = chatRepository.findByChatId(conversation.getChatId())
            .orElseThrow(() -> new IllegalArgumentException("Chat not found"));
        ChatMessage aiMessage = new ChatMessage();
        aiMessage.setChat(chat);
        aiMessage.setSender("AI");
        aiMessage.setMessage(textContent);
        aiMessage.setOpenaiResponseId(response.getId());
        ChatMessage savedMessage = messageRepository.save(aiMessage);

        List<String> toolTypes = (request.getTools() == null) ? null :
            request.getTools().stream()
                .map(tool -> (String) tool.get("type"))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        OpenAIResponse openAIResponse = OpenAIResponse.builder()
            .responseId(response.getId())
            .conversationId(conversation.getConversationId())
            .chatMessage(savedMessage)
            .previousResponseId(request.getPreviousResponseId())
            .model(response.getModel() != null ? response.getModel() : request.getModel())
            .toolsUsed(toolTypes)
            .completionTokens(response.getUsage() != null && response.getUsage().getCompletionTokens() != null ? 
                response.getUsage().getCompletionTokens() : 0)
            .promptTokens(response.getUsage() != null && response.getUsage().getPromptTokens() != null ? 
                response.getUsage().getPromptTokens() : 0)
            .totalTokens(response.getUsage() != null && response.getUsage().getTotalTokens() != null ? 
                response.getUsage().getTotalTokens() : 0)
            .responseTimeMs((int) responseTimeMs)
            .build();
        
        log.info("Saving OpenAIResponse with conversationId: {} and responseId: {}", 
            openAIResponse.getConversationId(), openAIResponse.getResponseId());
        
        conversationManager.recordResponse(openAIResponse);
        
        log.info("About to calculate usage cost");
        UsageMetric metric = costCalculationService.calculateUsageCost(
            request.getModel(),
            response.getUsage() != null && response.getUsage().getPromptTokens() != null ? 
                response.getUsage().getPromptTokens() : 0,
            response.getUsage() != null && response.getUsage().getCompletionTokens() != null ? 
                response.getUsage().getCompletionTokens() : 0,
            toolTypes
        );
        
        log.info("Calculated usage cost, setting metric properties");
        metric.setConversationId(conversation.getConversationId());
        metric.setResponseId(response.getId());
        metric.setUser(conversation.getUser());
        metric.setGuestSession(conversation.getGuestSession());
        
        log.info("Recording usage metric");
        conversationManager.recordUsage(metric);
        
        if (costCalculationService.shouldAlertCostThreshold(metric.getTotalCost())) {
            log.warn("Cost alert threshold reached for conversation {}: cost={}",
                conversation.getConversationId(), metric.getTotalCost());
        }

        log.info("Returning text content from processResponse");
        return textContent;
    }

    public String fallbackToChatGPT(String newUserMessage, List<ChatMessage> history,
                                    String specialtyCode, String language,
                                    List<FileAttachment> attachments,
                                    String chatId, User user, GuestSession guestSession,
                                    Exception ex) {
        log.warn("Falling back to ChatGPT API due to error: {}", ex.getMessage());
        if (!responsesConfig.isFallbackToChat()) {
            throw new RuntimeException("OpenAI Responses API failed and fallback is disabled", ex);
        }
        return chatGPTService.getChatResponse(newUserMessage, history, specialtyCode, language, attachments);
    }

    public ConversationManager.ConversationStats getConversationStats(String chatId) {
        Conversation conversation = conversationRepository.findByChatIdAndStatus(chatId, "active")
            .orElseThrow(() -> new IllegalArgumentException("No active conversation found for chat: " + chatId));
        return conversationManager.getConversationStats(conversation.getConversationId());
    }
}
