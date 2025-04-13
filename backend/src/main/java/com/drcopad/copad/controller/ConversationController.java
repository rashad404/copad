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
    public ResponseEntity<List<Conversation>> sendMessage(
            @PathVariable Long appointmentId,
            @RequestBody ConversationDTO dto,
            @AuthenticationPrincipal com.drcopad.copad.entity.User user) {

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }

        List<Conversation> messages = new ArrayList<>();

        Conversation userMsg = new Conversation();
        userMsg.setAppointment(appointment);
        userMsg.setSender("USER");
        userMsg.setMessage(dto.getMessage());
        userMsg.setTimestamp(LocalDateTime.now());
        conversationRepository.save(userMsg);

        List<Conversation> history = conversationRepository.findByAppointmentOrderByTimestampAsc(appointment);
        String aiReply = chatGPTService.getChatResponse(dto.getMessage(), history);


        Conversation aiMsg = new Conversation();
        aiMsg.setAppointment(appointment);
        aiMsg.setSender("AI");
        aiMsg.setMessage(aiReply);
        aiMsg.setTimestamp(LocalDateTime.now().plusSeconds(1));
        conversationRepository.save(aiMsg);

        messages.add(userMsg);
        messages.add(aiMsg);

        return ResponseEntity.ok(messages);
    }

    @GetMapping("/{appointmentId}")
    public ResponseEntity<List<Conversation>> getMessages(
            @PathVariable Long appointmentId,
            @AuthenticationPrincipal com.drcopad.copad.entity.User user) {

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }

        List<Conversation> history = conversationRepository.findByAppointmentOrderByTimestampAsc(appointment);
        return ResponseEntity.ok(history);
    }

}
