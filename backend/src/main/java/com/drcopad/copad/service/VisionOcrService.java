package com.drcopad.copad.service;

import com.drcopad.copad.config.ChatGPTConfig;
import com.drcopad.copad.dto.ChatGPTRequest;
import com.drcopad.copad.dto.ChatGPTResponse;
import com.drcopad.copad.dto.Message;
import com.drcopad.copad.dto.MessageContent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.Base64;
import java.util.List;

/**
 * Reads text off a photographed or scanned report.
 *
 * Most reports here arrive as a phone photo, which has no text layer, so
 * everything downstream - lab values, prescriptions, search - simply did not
 * apply to them.
 *
 * It transcribes; it does not interpret. The text goes to LabReportParser and
 * PrescriptionParser exactly as a text PDF would, and that is deliberate: those
 * parsers carry the rules that were worked out against real Azerbaijani reports
 * (decimal commas, abbreviations, the report's own reference ranges) and have
 * tests behind them. Asking a model for structured values instead would discard
 * all of it.
 *
 * The distinction also matters for safety. A transcriber that misreads a digit
 * produces a wrong number a reviewer can see against the image. An interpreter
 * can produce a plausible analyte that is not on the page at all, which nobody
 * can catch by looking.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class VisionOcrService {

    private final WebClient webClient;
    private final ChatGPTConfig chatGPTConfig;
    private final AiSpendService spend;

    /** Overridable, because transcription does not need the reasoning model. */
    @Value("${ocr.model:${app.chatgpt.openai.model:gpt-4o}}")
    private String model;

    @Value("${ocr.enabled:true}")
    private boolean enabled;

    /** An image large enough to be unreadable is not worth paying to send. */
    private static final long MAX_IMAGE_BYTES = 20L * 1024 * 1024;

    private static final String INSTRUCTION = """
            Transcribe every character of text in this image, exactly as printed.

            Rules:
            - Output only the transcription. No commentary, no summary, no explanation.
            - Preserve the line structure. One line in the image is one line of output.
            - Keep each row of a table on a single line, with its columns separated by
              spaces, in the order they appear.
            - Keep numbers exactly as written, including a comma used as a decimal
              separator. Do not convert, round or reformat them.
            - Keep Azerbaijani, Russian and English text in its own alphabet.
            - If a character is genuinely illegible, write ? in its place rather than
              guessing at it.
            - Do not add a value, a unit, a reference range or a heading that is not
              visible in the image.
            """;

    /**
     * The text in an image, or null when nothing could be read.
     *
     * Null rather than an exception: a document that cannot be transcribed is
     * still stored and still viewable, and the caller records that as a skipped
     * extraction rather than a failure.
     */
    public String transcribe(byte[] imageBytes, String contentType) {
        if (!enabled || imageBytes == null || imageBytes.length == 0) return null;
        if (imageBytes.length > MAX_IMAGE_BYTES) {
            log.info("Image too large to transcribe: {} bytes", imageBytes.length);
            return null;
        }

        // Counts against the same daily ceiling as chat. A folder of scans
        // must not quietly spend the budget the assistant needs.
        try {
            spend.requireBudget();
        } catch (AiSpendService.BudgetExhaustedException e) {
            log.warn("Skipping transcription: daily AI budget exhausted");
            return null;
        }

        String dataUrl = "data:" + (contentType == null ? "image/jpeg" : contentType)
                + ";base64," + Base64.getEncoder().encodeToString(imageBytes);

        MessageContent instruction = MessageContent.builder()
                .type("text").text(INSTRUCTION).build();
        MessageContent image = MessageContent.builder()
                .type("image_url")
                // High detail: a reference range in small print is the whole
                // point, and low detail loses exactly that.
                .image_url(new MessageContent.ImageUrl(dataUrl, "high"))
                .build();

        Message message = new Message();
        message.setRole("user");
        message.setContent(null);
        message.setContent_objects(List.of(instruction, image));

        ChatGPTRequest request = new ChatGPTRequest();
        request.setModel(model);
        request.setMessages(List.of(message));

        try {
            ChatGPTResponse response = webClient.post()
                    .uri(chatGPTConfig.getOpenai().getUrl())
                    .header("Authorization", "Bearer " + chatGPTConfig.getOpenai().getKey())
                    .header("Content-Type", "application/json")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(ChatGPTResponse.class)
                    // A scan is slower than a chat turn, but not unbounded.
                    .block(Duration.ofSeconds(120));

            if (response == null || response.getChoices() == null || response.getChoices().isEmpty()) {
                log.warn("Transcription returned no content");
                return null;
            }

            if (response.getUsage() != null) {
                spend.record(model, response.getUsage().getPromptTokens(),
                        response.getUsage().getCompletionTokens(), null);
            }

            String text = response.getChoices().get(0).getMessage().getContent();
            // The transcription is patient data; only its size is logged.
            log.info("Transcribed {} characters from an image", text == null ? 0 : text.length());
            return text == null || text.isBlank() ? null : text;

        } catch (Exception e) {
            log.warn("Could not transcribe image: {}", e.getClass().getSimpleName());
            return null;
        }
    }

    public boolean isEnabled() {
        return enabled;
    }
}
