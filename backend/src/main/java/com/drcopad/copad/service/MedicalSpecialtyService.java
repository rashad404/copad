package com.drcopad.copad.service;

import com.drcopad.copad.dto.MedicalSpecialtyDTO;
import com.drcopad.copad.entity.MedicalSpecialty;
import com.drcopad.copad.repository.MedicalSpecialtyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicalSpecialtyService {
    private final MedicalSpecialtyRepository specialtyRepository;

    public List<MedicalSpecialtyDTO> getAllActiveSpecialties() {
        return specialtyRepository.findByIsActiveTrue().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public MedicalSpecialtyDTO getSpecialtyByName(String name) {
        return specialtyRepository.findByName(name)
            .map(this::convertToDTO)
            .orElseThrow(() -> new IllegalArgumentException("Specialty not found: " + name));
    }

    public MedicalSpecialtyDTO getSpecialtyByCode(String code) {
        return specialtyRepository.findByCode(code)
            .map(this::convertToDTO)
            .orElseThrow(() -> new IllegalArgumentException("Invalid specialty code: " + code));
    }

    public MedicalSpecialtyDTO createSpecialty(MedicalSpecialtyDTO dto) {
        MedicalSpecialty specialty = new MedicalSpecialty();
        specialty.setName(dto.getName());
        specialty.setCode(dto.getCode());
        specialty.setSystemPrompt(dto.getSystemPrompt());
        specialty.setDescription(dto.getDescription());
        specialty.setIconUrl(dto.getIconUrl());
        specialty.setActive(dto.isActive());
        
        return convertToDTO(specialtyRepository.save(specialty));
    }

    private MedicalSpecialtyDTO convertToDTO(MedicalSpecialty specialty) {
        MedicalSpecialtyDTO dto = new MedicalSpecialtyDTO();
        dto.setId(specialty.getId());
        dto.setName(specialty.getName());
        dto.setCode(specialty.getCode());
        dto.setSystemPrompt(specialty.getSystemPrompt());
        dto.setDescription(specialty.getDescription());
        dto.setIconUrl(specialty.getIconUrl());
        dto.setActive(specialty.isActive());
        return dto;
    }
} 