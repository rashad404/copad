package com.drcopad.copad.controller;

import com.drcopad.copad.dto.MedicalSpecialtyDTO;
import com.drcopad.copad.service.MedicalSpecialtyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/specialties")
@RequiredArgsConstructor
public class MedicalSpecialtyController {
    private final MedicalSpecialtyService specialtyService;

    @GetMapping
    public ResponseEntity<List<MedicalSpecialtyDTO>> getAllActiveSpecialties() {
        return ResponseEntity.ok(specialtyService.getAllActiveSpecialties());
    }

    @GetMapping("/{name}")
    public ResponseEntity<MedicalSpecialtyDTO> getSpecialtyByName(@PathVariable String name) {
        return ResponseEntity.ok(specialtyService.getSpecialtyByName(name));
    }

    @PostMapping
    public ResponseEntity<MedicalSpecialtyDTO> createSpecialty(@RequestBody MedicalSpecialtyDTO dto) {
        return ResponseEntity.ok(specialtyService.createSpecialty(dto));
    }
} 