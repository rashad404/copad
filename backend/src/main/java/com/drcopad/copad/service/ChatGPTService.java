package com.drcopad.copad.service;

import java.io.IOException;
import java.nio.file.Files;
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

    /** Turns of history sent per request; roughly a dozen exchanges. */
    private static final int MAX_HISTORY_MESSAGES = 24;

    private final WebClient webClient;
    private final ChatGPTConfig chatGPTConfig;
    private final ObjectMapper objectMapper;
    private final MedicalSpecialtyRepository specialtyRepository;
    private final LanguageMappingService languageMappingService;
    private final DocumentExtractionService documentExtractionService;
    private final AttachmentStorageService attachmentStorage;
    private final AiSpendService spend;
    private final Deidentifier deidentifier;
    
    public ChatGPTConfig getChatGPTConfig() {
        return chatGPTConfig;
    }
    

    public String getChatResponse(String newUserMessage, List<ChatMessage> history, String specialtyCode, String language) {
        return getChatResponse(newUserMessage, history, specialtyCode, language, null);
    }
    
    public String getChatResponse(String newUserMessage, List<ChatMessage> history, String specialtyCode, String language, List<FileAttachment> attachments) {
        return getChatResponse(newUserMessage, history, specialtyCode, language, attachments, null);
    }

    /**
     * @param recordContext the patient's record, appended to the system prompt.
     *                      Null for anonymous conversations, which still work -
     *                      they simply get ungrounded answers.
     */
    public String getChatResponse(String newUserMessage, List<ChatMessage> history, String specialtyCode, String language, List<FileAttachment> attachments, String recordContext) {
        return getChatResponse(newUserMessage, history, specialtyCode, language, attachments, recordContext, (String) null);
    }

    /**
     * @param sessionId what the cost is attributed to, where the caller knows
     *                  it. Null is accepted: the spend still counts, it just
     *                  cannot be traced to a session.
     */
    public String getChatResponse(String newUserMessage, List<ChatMessage> history, String specialtyCode, String language, List<FileAttachment> attachments, String recordContext, String sessionId) {
        List<Message> messages = new ArrayList<>();
        
        // Get specialty-specific prompt
        MedicalSpecialty specialty = specialtyRepository.findByCode(specialtyCode)
            .orElseThrow(() -> new IllegalArgumentException("Invalid specialty code: " + specialtyCode));
            
        // Add specialty-specific system prompt with language instruction
        String fullLanguageName = languageMappingService.getFullLanguageName(language);

        // Enhanced system prompt that handles files and images
        String systemPrompt = specialty.getSystemPrompt() +
            """

            You are azdoc, a medical assistant. Answer the person in front of you directly and usefully.

            How to answer:
            - Lead with the answer. No preamble about what you are or what you cannot do.
            - Be specific. Name things, give amounts, say how long. Vague advice helps nobody.
            - Keep it short and scannable. Short paragraphs or a few bullets, not an essay.
            - Plain language. Explain a medical term the first time you use it.
            - If something genuinely needs to be seen in person, say so once, plainly, and say why.
            - Use plain punctuation: a hyphen, not a long dash; straight quotes, not curly
              ones; three dots, not a single character. Azerbaijani letters are content and
              stay as they are - this is about typography only.

            Do not:
            - Do not add a disclaimer to every message. The interface carries a standing
              notice that this is not a substitute for a doctor, so repeating it buries the
              useful part and reads as evasive.
            - Do not open with "I am not a doctor" or "consult a healthcare professional".
            - Do not refuse a reasonable question by deferring. Answer it, and flag the
              limits of what can be judged remotely if that matters.
            - Do not pad with caveats a person cannot act on.

            Doses:
            - Never give a dose, a strength or a schedule for a medicine that is sold on
              prescription. Say what the medicine is and what it is for, and that the
              amount is set by whoever prescribes it. This holds even when the person
              says they have taken it before, and even when they ask directly.
            - For a medicine sold without a prescription, give only the dosing that the
              registry entry below carries, and say that is where it comes from. If the
              entry carries none, say the pack leaflet has it. Never supply one from
              memory: the registered strengths here are not the ones you were trained on.
            - A dose already written on this person's own prescription can be read back
              and explained. Do not change it and do not offer a different amount.

            Urgency is not a disclaimer. If what is described could be an emergency, say so
            first, say plainly what to do, and give the local emergency number (103 in
            Azerbaijan). Be concrete, not alarming.
            """ +
            (recordContext != null && !recordContext.isBlank() ? recordContext : "") +
            (fullLanguageName != null ? String.format("%nAnswer in %s.", fullLanguageName) : "");

        // The system prompt and the history were both commented out, so every
        // request reached the model as a bare standalone question: specialty
        // prompts, the language instruction and the patient record were built
        // and then discarded, and the assistant had no memory of the
        // conversation. History is loaded before the new message is saved, so
        // appending both does not duplicate.
        messages.add(new Message("system", systemPrompt));

        // Recent turns only. A long conversation would otherwise grow the
        // request without bound, and its cost is paid on every turn.
        List<ChatMessage> recent = history == null ? List.of()
                : history.size() <= MAX_HISTORY_MESSAGES ? history
                : history.subList(history.size() - MAX_HISTORY_MESSAGES, history.size());

        for (ChatMessage c : recent) {
            String role = c.getSender().equalsIgnoreCase("USER") ? "user" : "assistant";
            if (c.getAttachments() == null || c.getAttachments().isEmpty()) {
                messages.add(new Message(role, c.getMessage()));
            } else {
                processMessageWithAttachments(messages, c, role);
            }
        }

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

        return getChatGPTResponse(messages, sessionId).block();
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
                            
                            // Always sent as data, never as a URL. Handing
                            // OpenAI a link to the file would mean the file had
                            // to be publicly fetchable, which is the exposure
                            // this storage change removes.
                            // Through the storage service, not off the disk:
                            // the file is encrypted at rest, and raw bytes
                            // would be sent to OpenAI as ciphertext.
                            byte[] imageBytes = attachmentStorage.readAllBytes(image);
                            String mimeType = image.getFileType() == null
                                    || image.getFileType().isEmpty()
                                    ? "image/jpeg" : image.getFileType();
                            imageContent.setImage_url(new MessageContent.ImageUrl(
                                    "data:" + mimeType + ";base64,"
                                            + Base64.getEncoder().encodeToString(imageBytes),
                                    "high"));

                            contentObjects.add(imageContent);
                        } catch (IOException e) {
                            // The filename is not logged: it can carry a name.
                            log.error("Failed to process image attachment {}", image.getId(), e);
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
            // Numbered rather than named. A filename routinely carries the
            // patient's name and told the model nothing it could use.
            int attachmentIndex = 0;
            
            for (FileAttachment doc : chatMessage.getAttachments()) {
                if (!doc.getFileType().startsWith("image/")) {
                    String extractedText;
                    try {
                        extractedText = documentExtractionService.extractText(
                                attachmentStorage.readAllBytes(doc), doc.getFileType());
                    } catch (IOException e) {
                        // One unreadable attachment should not lose the message.
                        log.warn("Could not read attachment {}", doc.getId());
                        extractedText = null;
                    }
                    
                    if (extractedText != null && !extractedText.trim().isEmpty()) {
                        enhancedMessage.append("\n").append(
                                deidentifier.labelFor(doc.getFileType(), ++attachmentIndex))
                                .append(":\n");
                        enhancedMessage.append(deidentifier.clean(extractedText)).append("\n");
                    } else {
                        enhancedMessage.append("\n").append(
                                deidentifier.labelFor(doc.getFileType(), ++attachmentIndex))
                                .append(" (could not be read)\n");
                    }
                }
            }
            
            messages.add(new Message(role, enhancedMessage.toString()));
        } else {
            // No attachments, just include the text message
            messages.add(new Message(role, chatMessage.getMessage()));
        }
    }

    private Mono<String> getChatGPTResponse(List<Message> messages, String sessionId) {
        boolean useDummyData = chatGPTConfig.isUseDummyData();
        log.info("Injected config values - useDummyData={}, model={}, url={}", 
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
            // The serialised request contains the full conversation, so only
            // its size is logged.
            log.info("Sending request to ChatGPT API ({} bytes)", requestJson.length());
            // Log the first 1000 characters of each message content to debug
            request.getMessages().forEach(msg -> {
                if (msg.getContentForJson() instanceof List) {
                    log.info("Message role: {}, content type: List with {} items", msg.getRole(), ((List<?>) msg.getContentForJson()).size());
                } else if (msg.getContentForJson() instanceof String) {
                    String content = (String) msg.getContentForJson();
                    // Length only: the content is patient medical data.
                    log.info("Message role: {}, content length: {}", msg.getRole(), content.length());
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
                            // The error body echoes the prompt, so only the status is logged.
                            log.error("OpenAI API error response: Status={}", response.statusCode());
                            return Mono.error(new RuntimeException("OpenAI API error: " + response.statusCode() + " - " + body));
                        }))
                .bodyToMono(ChatGPTResponse.class)
                .map(response -> {
                    // The response is medical advice about the patient; log shape only.
                    log.info("Received response from ChatGPT API");
                    // Recorded here because this is the only place the token
                    // counts exist. Until now this path recorded nothing, so
                    // the endpoint that spends the money was the one endpoint
                    // with no accounting.
                    if (response.getUsage() != null) {
                        spend.record(chatGPTConfig.getOpenai().getModel(),
                                response.getUsage().getPromptTokens(),
                                response.getUsage().getCompletionTokens(),
                                sessionId);
                    }
                    if (response.getChoices() != null && !response.getChoices().isEmpty()) {
                        String content = response.getChoices().get(0).getMessage().getContent();
                        if (content != null) {
                            // Asked for in the prompt, guaranteed here: models
                            // mostly comply, which is not the same as complying.
                            return PlainPunctuation.apply(content);
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
                            // Body omitted: it echoes the request, including patient content.
                            log.error("Status code: {}", responseException.getStatusCode());
                        }
                    }
                    return Mono.just("I apologize, but I'm having trouble processing your request at the moment. Please try again later.");
                });
    }

    private Mono<String> getDummyResponse(List<Message> messages) {
        log.info("Using dummy response for {} messages", messages == null ? 0 : messages.size());
        
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
