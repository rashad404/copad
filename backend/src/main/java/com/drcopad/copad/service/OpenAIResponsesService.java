package com.drcopad.copad.service;

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
import com.drcopad.copad.repository.MessageRepository;
import com.drcopad.copad.repository.MedicalSpecialtyRepository;
import com.drcopad.copad.repository.responses.ConversationFileRepository;
import com.drcopad.copad.repository.responses.ConversationRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
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
    private final FileUploadService fileUploadService;
    private final ObjectMapper objectMapper;
    private final ChatGPTService chatGPTService; // Fallback service
    
    public OpenAIResponsesService(WebClient webClient,
                                  @Qualifier("openAIResponsesConfig") OpenAIResponsesConfig responsesConfig,
                                  ConversationManager conversationManager,
                                  CostCalculationService costCalculationService,
                                  MedicalSpecialtyRepository specialtyRepository,
                                  ChatRepository chatRepository,
                                  MessageRepository messageRepository,
                                  ConversationRepository conversationRepository,
                                  ConversationFileRepository conversationFileRepository,
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
        this.fileUploadService = fileUploadService;
        this.objectMapper = objectMapper;
        this.chatGPTService = chatGPTService;
    }
    
    @CircuitBreaker(name = "openai-responses", fallbackMethod = "fallbackToChatGPT")
    @Retry(name = "openai-responses")
    @RateLimiter(name = "openai-responses")
    public String getResponsesAPIResponse(String newUserMessage, List<ChatMessage> history, 
                                         String specialtyCode, String language, 
                                         List<FileAttachment> attachments,
                                         String chatId, User user, GuestSession guestSession) {
        
        // Check if Responses API is enabled
        if (!responsesConfig.isEnabled()) {
            log.info("Responses API is disabled, falling back to ChatGPT API");
            return chatGPTService.getChatResponse(newUserMessage, history, specialtyCode, language, attachments);
        }
        
        // Check cost limits
        if (user != null && costCalculationService.hasExceededDailyLimit(user.getId())) {
            throw new CostLimitExceededException("Daily cost limit exceeded");
        }
        if (guestSession != null && costCalculationService.hasGuestExceededDailyLimit(guestSession.getId())) {
            throw new CostLimitExceededException("Daily token limit exceeded for guest session");
        }
        
        // Get or create conversation
        Conversation conversation = conversationManager.getOrCreateConversation(
            chatId, user, guestSession, specialtyCode, language
        );
        
        // Check if conversation is expired
        if (conversation.isExpired()) {
            throw new ConversationExpiredException("Conversation has expired. Please start a new conversation.");
        }
        
        // Get specialty system prompt
        MedicalSpecialty specialty = specialtyRepository.findByCode(specialtyCode)
            .orElseThrow(() -> new IllegalArgumentException("Invalid specialty code: " + specialtyCode));
        
        // Process file attachments if any
        List<String> fileIds = new ArrayList<>();
        if (attachments != null && !attachments.isEmpty()) {
            fileIds = processFileAttachments(attachments, conversation);
        }
        
        // Build the request
        ResponsesAPIRequest request = buildRequest(
            newUserMessage, 
            conversation, 
            specialty.getSystemPrompt(), 
            language,
            fileIds
        );
        
        // Record start time
        Instant startTime = Instant.now();
        
        // Make the API call
        return executeAPICall(request, conversation, startTime)
            .block(Duration.ofSeconds(30));
    }
    
    private ResponsesAPIRequest buildRequest(String userMessage, Conversation conversation, 
                                           String systemPrompt, String language, List<String> fileIds) {
        
        // Get the last response ID for conversation chaining
        String previousResponseId = conversationManager.getLastResponseId(conversation.getConversationId())
            .orElse(null);
        
        // Build tools list based on configuration
        List<String> tools = new ArrayList<>();
        if (responsesConfig.getTools().isFileSearch() && !fileIds.isEmpty()) {
            tools.add("file_search");
        }
        if (responsesConfig.getTools().isWebSearch()) {
            tools.add("web_search");
        }
        if (responsesConfig.getTools().isCodeInterpreter()) {
            tools.add("code_interpreter");
        }
        
        // Enhance system prompt with language instruction
        String fullSystemPrompt = systemPrompt + 
            "\nPlease respond in " + language + ".";
        
        return ResponsesAPIRequest.builder()
            .model(conversation.getModel())
            .input(userMessage)
            .systemPrompt(fullSystemPrompt)
            .previousResponseId(previousResponseId)
            .conversationId(conversation.getConversationId())
            .tools(tools)
            .fileIds(fileIds)
            .temperature(0.7)
            .maxTokens(2000)
            .build();
    }
    
    private List<String> processFileAttachments(List<FileAttachment> attachments, Conversation conversation) {
        List<String> openaiFileIds = new ArrayList<>();
        
        for (FileAttachment attachment : attachments) {
            try {
                // Check if file is already processed for OpenAI
                if (attachment.getOpenaiFileId() != null) {
                    openaiFileIds.add(attachment.getOpenaiFileId());
                    continue;
                }
                
                // Upload file to OpenAI
                String openaiFileId = fileUploadService.uploadToOpenAI(attachment);
                attachment.setOpenaiFileId(openaiFileId);
                
                // Create conversation file record
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
        } else if (fileType.contains("dicom") || filename.contains("xray") || filename.contains("mri") || 
                   filename.contains("ct") || filename.contains("scan")) {
            return "imaging";
        } else if (filename.contains("note") || filename.contains("report") || filename.contains("summary")) {
            return "clinical-notes";
        }
        
        return "general";
    }
    
    private Mono<String> executeAPICall(ResponsesAPIRequest request, Conversation conversation, Instant startTime) {
        log.info("Calling OpenAI Responses API with request: {}", request);
        
        return webClient.post()
            .uri(responsesConfig.getUrl())
            .header("Authorization", "Bearer " + chatGPTService.getChatGPTConfig().getOpenai().getKey())
            .header("Content-Type", "application/json")
            .bodyValue(request)
            .retrieve()
            .onStatus(status -> !status.is2xxSuccessful(),
                response -> response.bodyToMono(String.class)
                    .flatMap(body -> {
                        log.error("OpenAI Responses API error: Status={}, Body={}", response.statusCode(), body);
                        return Mono.error(new RuntimeException("OpenAI API error: " + response.statusCode()));
                    }))
            .bodyToMono(ResponsesAPIResponse.class)
            .map(response -> processResponse(response, conversation, request, startTime))
            .doOnError(error -> log.error("Error calling OpenAI Responses API", error));
    }
    
    private String processResponse(ResponsesAPIResponse response, Conversation conversation, 
                                 ResponsesAPIRequest request, Instant startTime) {
        
        // Calculate response time
        long responseTimeMs = Duration.between(startTime, Instant.now()).toMillis();
        
        // Save chat message
        Chat chat = chatRepository.findByChatId(conversation.getChatId())
            .orElseThrow(() -> new IllegalArgumentException("Chat not found"));
        
        ChatMessage aiMessage = new ChatMessage();
        aiMessage.setChat(chat);
        aiMessage.setSender("AI");
        aiMessage.setMessage(response.getContent());
        aiMessage.setOpenaiResponseId(response.getResponseId());
        ChatMessage savedMessage = messageRepository.save(aiMessage);
        
        // Record OpenAI response
        OpenAIResponse openAIResponse = OpenAIResponse.builder()
            .responseId(response.getResponseId())
            .conversationId(conversation.getConversationId())
            .chatMessage(savedMessage)
            .previousResponseId(request.getPreviousResponseId())
            .model(request.getModel())
            .toolsUsed(request.getTools())
            .completionTokens(response.getUsage().getCompletionTokens())
            .promptTokens(response.getUsage().getPromptTokens())
            .totalTokens(response.getUsage().getTotalTokens())
            .responseTimeMs((int) responseTimeMs)
            .build();
        
        conversationManager.recordResponse(openAIResponse);
        
        // Calculate and record usage metrics
        UsageMetric metric = costCalculationService.calculateUsageCost(
            request.getModel(),
            response.getUsage().getPromptTokens(),
            response.getUsage().getCompletionTokens(),
            request.getTools()
        );
        
        metric.setConversationId(conversation.getConversationId());
        metric.setResponseId(response.getResponseId());
        metric.setUser(conversation.getUser());
        metric.setGuestSession(conversation.getGuestSession());
        
        conversationManager.recordUsage(metric);
        
        // Check if we should alert about costs
        if (costCalculationService.shouldAlertCostThreshold(metric.getTotalCost())) {
            log.warn("Cost alert threshold reached for conversation: {}, cost: {}", 
                    conversation.getConversationId(), metric.getTotalCost());
        }
        
        return response.getContent();
    }
    
    /**
     * Fallback method when Responses API fails
     */
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
    
    /**
     * Get conversation statistics
     */
    public ConversationManager.ConversationStats getConversationStats(String chatId) {
        Conversation conversation = conversationRepository.findByChatIdAndStatus(chatId, "active")
            .orElseThrow(() -> new IllegalArgumentException("No active conversation found for chat: " + chatId));
        
        return conversationManager.getConversationStats(conversation.getConversationId());
    }
}