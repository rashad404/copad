package com.drcopad.copad.controller;

import com.drcopad.copad.dto.AppointmentDTO;
import com.drcopad.copad.dto.AppointmentRequestDTO;
import com.drcopad.copad.entity.Appointment;
import com.drcopad.copad.entity.User;
import com.drcopad.copad.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@RequestBody AppointmentRequestDTO dto, @AuthenticationPrincipal User user) {
        Appointment appointment = new Appointment();
        appointment.setUser(user);
        appointment.setSpecialty(dto.getSpecialty());
        appointment.setPrimaryConcern(dto.getPrimaryConcern());
        appointment.setSymptoms(dto.getSymptoms());
        appointment.setDuration(dto.getDuration());
        appointment.setSeverity(dto.getSeverity());
        appointment.setTreatmentsTried(dto.getTreatmentsTried());
        appointment.setNotes(dto.getNotes());
        appointment.setCreatedAt(LocalDateTime.now());
        return ResponseEntity.ok(appointmentRepository.save(appointment));
    }

    @GetMapping
    public ResponseEntity<List<AppointmentDTO>> getUserAppointments(@AuthenticationPrincipal User user) {
        List<AppointmentDTO> result = appointmentRepository.findByUser(user).stream().map(appointment -> {
            AppointmentDTO dto = new AppointmentDTO();
            dto.setId(appointment.getId());
            dto.setSpecialty(appointment.getSpecialty());
            dto.setPrimaryConcern(appointment.getPrimaryConcern());
            dto.setSymptoms(appointment.getSymptoms());
            dto.setDuration(appointment.getDuration());
            dto.setSeverity(appointment.getSeverity());
            dto.setTreatmentsTried(appointment.getTreatmentsTried());
            dto.setNotes(appointment.getNotes());
            dto.setCreatedAt(appointment.getCreatedAt());
            return dto;
        }).toList();

        return ResponseEntity.ok(result);
    }

}
