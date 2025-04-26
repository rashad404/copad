package com.drcopad.copad.service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.drcopad.copad.config.ChatGPTConfig;
import com.drcopad.copad.dto.ChatGPTRequest;
import com.drcopad.copad.dto.ChatGPTResponse;
import com.drcopad.copad.dto.Message;
import com.drcopad.copad.entity.ChatMessage;
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

    public String getChatResponse(String newUserMessage, List<ChatMessage> history, String specialtyCode, String language) {
        List<Message> messages = new ArrayList<>();
        
        // Get specialty-specific prompt
        MedicalSpecialty specialty = specialtyRepository.findByCode(specialtyCode)
            .orElseThrow(() -> new IllegalArgumentException("Invalid specialty code: " + specialtyCode));
            
        // Add specialty-specific system prompt with language instruction
        String fullLanguageName = languageMappingService.getFullLanguageName(language);


        String systemPrompt = specialty.getSystemPrompt() +
            "\nYou are an AI doctor providing concise, practical medical information. Follow these guidelines:\n" +
            "1. Give direct, actionable advice without unnecessary introductions.\n" +
            "2. Use simple language and short sentences.\n" +
            "3. Format your responses as brief bullet points when possible.\n" +
            "4. Include this disclaimer with medical recommendations: \"These suggestions are not medical advice. Please consult your doctor.\"\n" +
            "5. Admit knowledge gaps directly without speculation.\n" +
            "6. Only share evidence-based information.\n" +
            "7. List common medication side effects briefly when relevant.\n" +
            "8. Never diagnose – describe potential conditions only.\n" +
            "9. Clearly flag emergency symptoms requiring immediate care.\n" +
            "10. Stay within your knowledge scope.\n" +
            "11. Prioritize the most effective solutions first.\n" +
            "12. Avoid pleasantries and get straight to helpful information.\n" +
            "13. Respond politely to greetings and expressions of thanks. For all other unrelated, inappropriate, or off-topic questions, politely refuse by saying: \"I'm an AI doctor. Please ask health-related questions only.\"\n" +
            "14. If a user asks non-medical questions (e.g., about coding, finance, games, etc.), kindly remind them: \"I'm an AI doctor. Please ask health-related questions only.\"" +
            (fullLanguageName != null ? String.format("\nPlease respond in %s.", fullLanguageName) : "");

        messages.add(new Message("system", systemPrompt));


        // Add message history
        for (ChatMessage c : history) {
            String role = c.getSender().equalsIgnoreCase("USER") ? "user" : "assistant";
            messages.add(new Message(role, c.getMessage()));
        }

        messages.add(new Message("user", newUserMessage));

        return getChatGPTResponse(messages).block();
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
            log.info("Sending request to ChatGPT API: {}", objectMapper.writeValueAsString(request));
        } catch (Exception e) {
            log.error("Error serializing request", e);
        }

        return webClient.post()
                .uri(chatGPTConfig.getOpenai().getUrl())
                .header("Authorization", "Bearer " + chatGPTConfig.getOpenai().getKey())
                .header("OpenAI-Beta", "assistants=v1") // Required for Responses API
                .bodyValue(request)
                .retrieve()
                .bodyToMono(ChatGPTResponse.class)
                .map(response -> {
                    log.info("Received response from ChatGPT API: {}", response);
                    if (response.getChoices() != null && !response.getChoices().isEmpty()) {
                        return response.getChoices().get(0).getMessage().getContent();
                    }
                    return "I apologize, but I couldn't generate a response. Please try again.";
                })
                .onErrorResume(e -> {
                    log.error("Error calling ChatGPT API. Error details: {}", e.getMessage(), e);
                    if (e.getMessage() != null) {
                        log.error("Full error stack trace:", e);
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
