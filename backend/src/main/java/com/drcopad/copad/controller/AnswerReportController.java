package com.drcopad.copad.controller;

import com.drcopad.copad.entity.AnswerReport;
import com.drcopad.copad.entity.ChatMessage;
import com.drcopad.copad.entity.User;
import com.drcopad.copad.repository.AnswerReportRepository;
import com.drcopad.copad.repository.MessageRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

/**
 * Reporting an answer.
 *
 * Open to a guest, because most conversations here are had without an account
 * and the person who most needs to report a bad answer is the one who just
 * received it.
 */
@Slf4j
@RestController
@RequestMapping("/api/guest/answers")
@RequiredArgsConstructor
public class AnswerReportController {

    private final AnswerReportRepository reports;
    private final MessageRepository messages;

    @Data
    public static class ReportRequest {
        private Long messageId;
        private AnswerReport.Reason reason;
        private String note;
    }

    @PostMapping("/report")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> report(@RequestBody ReportRequest body,
                                      @RequestHeader(value = "X-Guest-Session-Id",
                                              required = false) String sessionId,
                                      @AuthenticationPrincipal User user) {

        ChatMessage message = messages.findById(body.getMessageId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "That message does not exist"));

        // Only the assistant's own words can be reported. A person reporting
        // their own message would be reporting themselves, and it would put
        // what they wrote in front of a reviewer for no reason.
        if (!"AI".equalsIgnoreCase(message.getSender())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Only an answer can be reported");
        }

        if (sessionId != null
                && reports.existsByChatMessageIdAndGuestSessionId(message.getId(), sessionId)) {
            // Reporting twice is not two problems.
            return Map.of("status", "already reported");
        }

        AnswerReport report = new AnswerReport();
        report.setChatMessage(message);
        report.setReason(body.getReason() == null ? AnswerReport.Reason.OTHER : body.getReason());
        report.setNote(body.getNote() == null || body.getNote().isBlank()
                ? null : body.getNote().trim());
        report.setReportedBy(user);
        report.setGuestSessionId(sessionId);
        reports.save(report);

        // The message id and the kind of complaint. Never the answer itself or
        // what the person wrote about it.
        log.warn("Answer {} reported as {}", message.getId(), report.getReason());
        return Map.of("status", "received");
    }
}
