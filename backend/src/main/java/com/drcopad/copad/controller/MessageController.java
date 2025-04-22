package com.drcopad.copad.controller;

import com.drcopad.copad.dto.MessageDTO;
import com.drcopad.copad.dto.MessageRequest;
import com.drcopad.copad.entity.Appointment;
import com.drcopad.copad.entity.ChatMessage;
import com.drcopad.copad.repository.AppointmentRepository;
import com.drcopad.copad.repository.MessageRepository;
import com.drcopad.copad.service.ChatGPTService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final AppointmentRepository appointmentRepository;
    private final MessageRepository MessageRepository;
    private final ChatGPTService chatGPTService;


    @PostMapping("/{appointmentId}")
    public ResponseEntity<ChatMessage> sendMessage(
            @PathVariable Long appointmentId,
            @RequestBody MessageRequest messageRequest) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));

        // Get message history
        List<ChatMessage> history = MessageRepository.findByAppointmentOrderByTimestampAsc(appointment);

        // Get AI response using the appointment's specialty and language
        String aiResponse = chatGPTService.getChatResponse(
            messageRequest.getMessage(), 
            history, 
            appointment.getSpecialty(),
            messageRequest.getLanguage()
        );

        // Save user message
        ChatMessage userMessage = new ChatMessage();
        userMessage.setAppointment(appointment);
        userMessage.setSender("USER");
        userMessage.setMessage(messageRequest.getMessage());
        userMessage.setTimestamp(LocalDateTime.now());
        MessageRepository.save(userMessage);

        // Save AI response
        ChatMessage aiMessage = new ChatMessage();
        aiMessage.setAppointment(appointment);
        aiMessage.setSender("AI");
        aiMessage.setMessage(aiResponse);
        aiMessage.setTimestamp(LocalDateTime.now());
        return ResponseEntity.ok(MessageRepository.save(aiMessage));
    }

    @GetMapping("/{appointmentId}")
    public ResponseEntity<List<ChatMessage>> getMessageHistory(@PathVariable Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));
        return ResponseEntity.ok(MessageRepository.findByAppointmentOrderByTimestampAsc(appointment));
    }

}
