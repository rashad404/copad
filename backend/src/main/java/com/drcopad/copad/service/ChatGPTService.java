package com.drcopad.copad.service;

import com.drcopad.copad.dto.ChatGPTRequest;
import com.drcopad.copad.dto.ChatGPTResponse;
import com.drcopad.copad.entity.Conversation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;

@Service
public class ChatGPTService {

    private final RestClient restClient;

    public ChatGPTService(RestClient restClient) {
        this.restClient = restClient;
    }

    @Value("${openapi.api.key}")
    private String apiKey;

    @Value("${openapi.api.model}")
    private String model;

    public String getChatResponse(String newUserMessage, List<Conversation> history) {
        List<ChatGPTRequest.Message> messages = new ArrayList<>();

        messages.add(new ChatGPTRequest.Message("system", "You are a helpful and experienced medical doctor."));

        for (Conversation c : history) {
            String role = c.getSender().equalsIgnoreCase("USER") ? "user" : "assistant";
            messages.add(new ChatGPTRequest.Message(role, c.getMessage()));
        }

        messages.add(new ChatGPTRequest.Message("user", newUserMessage));

        ChatGPTRequest request = new ChatGPTRequest(model, messages);

        ChatGPTResponse response = restClient.post()
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .body(request)
                .retrieve()
                .body(ChatGPTResponse.class);

        return response.choices().get(0).message().content();
    }
}
