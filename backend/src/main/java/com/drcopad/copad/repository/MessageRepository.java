package com.drcopad.copad.repository;

import com.drcopad.copad.entity.Appointment;
import com.drcopad.copad.entity.Chat;
import com.drcopad.copad.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByAppointmentOrderByTimestampAsc(Appointment appointment);
    List<ChatMessage> findByChatOrderByTimestampAsc(Chat chat);
}