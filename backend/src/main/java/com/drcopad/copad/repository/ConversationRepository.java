package com.drcopad.copad.repository;

import com.drcopad.copad.entity.Appointment;
import com.drcopad.copad.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    List<Conversation> findByAppointmentOrderByTimestampAsc(Appointment appointment);
}
