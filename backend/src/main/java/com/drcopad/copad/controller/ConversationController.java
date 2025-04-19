package com.drcopad.copad.controller;

import com.drcopad.copad.dto.ConversationDTO;
import com.drcopad.copad.entity.Appointment;
import com.drcopad.copad.entity.Conversation;
import com.drcopad.copad.repository.AppointmentRepository;
import com.drcopad.copad.repository.ConversationRepository;
import com.drcopad.copad.service.ChatGPTService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class ConversationController {

    private final AppointmentRepository appointmentRepository;
    private final ConversationRepository conversationRepository;
    private final ChatGPTService chatGPTService;


    @PostMapping("/{appointmentId}")
    public ResponseEntity<Conversation> sendMessage(
            @PathVariable Long appointmentId,
            @RequestBody String message) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));

        // Get conversation history
        List<Conversation> history = conversationRepository.findByAppointmentOrderByTimestampAsc(appointment);

        // Get AI response using the appointment's specialty
        String aiResponse = chatGPTService.getChatResponse(message, history, appointment.getSpecialty());

        // Save user message
        Conversation userMessage = new Conversation();
        userMessage.setAppointment(appointment);
        userMessage.setSender("USER");
        userMessage.setMessage(message);
        userMessage.setTimestamp(LocalDateTime.now());
        conversationRepository.save(userMessage);

        // Save AI response
        Conversation aiMessage = new Conversation();
        aiMessage.setAppointment(appointment);
        aiMessage.setSender("AI");
        aiMessage.setMessage(aiResponse);
        aiMessage.setTimestamp(LocalDateTime.now());
        return ResponseEntity.ok(conversationRepository.save(aiMessage));
    }

    @GetMapping("/{appointmentId}")
    public ResponseEntity<List<Conversation>> getConversationHistory(@PathVariable Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));
        return ResponseEntity.ok(conversationRepository.findByAppointmentOrderByTimestampAsc(appointment));
    }

}
