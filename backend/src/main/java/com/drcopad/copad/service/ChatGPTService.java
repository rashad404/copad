package com.drcopad.copad.service;

import com.drcopad.copad.config.ChatGPTConfig;
import com.drcopad.copad.dto.ChatGPTRequest;
import com.drcopad.copad.dto.ChatGPTResponse;
import com.drcopad.copad.dto.Message;
import com.drcopad.copad.entity.Conversation;
import com.drcopad.copad.entity.MedicalSpecialty;
import com.drcopad.copad.repository.MedicalSpecialtyRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatGPTService {

    private final WebClient webClient;
    private final ChatGPTConfig chatGPTConfig;
    private final ObjectMapper objectMapper;
    private final MedicalSpecialtyRepository specialtyRepository;

    public String getChatResponse(String newUserMessage, List<Conversation> history, String specialtyName, String language) {
        List<Message> messages = new ArrayList<>();
        
        // Get specialty-specific prompt
        MedicalSpecialty specialty = specialtyRepository.findByName(specialtyName)
            .orElseThrow(() -> new IllegalArgumentException("Invalid specialty: " + specialtyName));
            
        // Add specialty-specific system prompt with language instruction
        String systemPrompt = specialty.getSystemPrompt() + 
            (language != null ? String.format("\nPlease respond in %s.", language) : "");
        messages.add(new Message("system", systemPrompt));

        // Add conversation history
        for (Conversation c : history) {
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
