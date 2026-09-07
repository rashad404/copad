package com.drcopad.copad.controller;

import com.drcopad.copad.dto.MedicalSpecialtyDTO;
import com.drcopad.copad.service.MedicalSpecialtyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Administration of medical specialties.
 *
 * These records hold the system prompts that govern the medical assistant's
 * behaviour, so writing them is an administrative act. The create endpoint
 * previously sat on the public /api/specialties controller, which the security
 * config only requires to be authenticated - and registration is open, so any
 * user who signed up could rewrite the AI's clinical instructions. Everything
 * under /api/admin/** requires the ADMIN role.
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/specialties")
@RequiredArgsConstructor
public class AdminSpecialtyController {

    private final MedicalSpecialtyService specialtyService;

    @GetMapping
    public ResponseEntity<List<MedicalSpecialtyDTO>> list() {
        return ResponseEntity.ok(specialtyService.getAllActiveSpecialties());
    }

    @PostMapping
    public ResponseEntity<MedicalSpecialtyDTO> create(@RequestBody MedicalSpecialtyDTO dto) {
        log.info("Admin creating medical specialty: {}", dto.getCode());
        return ResponseEntity.ok(specialtyService.createSpecialty(dto));
    }
}
