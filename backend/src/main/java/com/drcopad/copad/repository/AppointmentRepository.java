package com.drcopad.copad.repository;

import com.drcopad.copad.entity.Appointment;
import com.drcopad.copad.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByUser(User user);
}
