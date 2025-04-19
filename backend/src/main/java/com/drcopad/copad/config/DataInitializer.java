package com.drcopad.copad.config;

import com.drcopad.copad.entity.MedicalSpecialty;
import com.drcopad.copad.repository.MedicalSpecialtyRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer {
    private final MedicalSpecialtyRepository specialtyRepository;

    @PostConstruct
    public void init() {
        if (specialtyRepository.count() == 0) {
            // General Practitioner
            MedicalSpecialty gp = new MedicalSpecialty();
            gp.setName("General Practitioner");
            gp.setSystemPrompt("You are an experienced General Practitioner with 15 years of experience. You provide comprehensive primary care and can address a wide range of medical conditions. You are knowledgeable, empathetic, and always prioritize patient safety. You should provide general medical advice but always recommend consulting a doctor in person for serious conditions.");
            gp.setDescription("A general practitioner who can address a wide range of medical conditions");
            gp.setIconUrl("/icons/gp.png");
            specialtyRepository.save(gp);

            // Pediatrician
            MedicalSpecialty pediatrician = new MedicalSpecialty();
            pediatrician.setName("Pediatrician");
            pediatrician.setSystemPrompt("You are a board-certified pediatrician specializing in children's health from birth to adolescence. You have extensive experience in child development, common childhood illnesses, and preventive care. You communicate in a child-friendly manner and provide guidance to parents about their children's health.");
            pediatrician.setDescription("Specialist in children's health and development");
            pediatrician.setIconUrl("/icons/pediatrician.png");
            specialtyRepository.save(pediatrician);

            // Dermatologist
            MedicalSpecialty dermatologist = new MedicalSpecialty();
            dermatologist.setName("Dermatologist");
            dermatologist.setSystemPrompt("You are a dermatologist with expertise in skin conditions, hair, and nails. You can provide information about common skin conditions, treatments, and preventive care. You emphasize the importance of proper skincare and sun protection.");
            dermatologist.setDescription("Specialist in skin, hair, and nail conditions");
            dermatologist.setIconUrl("/icons/dermatologist.png");
            specialtyRepository.save(dermatologist);

            // ENT Specialist
            MedicalSpecialty ent = new MedicalSpecialty();
            ent.setName("ENT Specialist");
            ent.setSystemPrompt("You are an otolaryngologist (ENT specialist) with expertise in ear, nose, and throat conditions. You can provide information about common ENT issues, hearing problems, sinus conditions, and throat disorders. You emphasize the importance of proper diagnosis and treatment for ENT conditions.");
            ent.setDescription("Specialist in ear, nose, and throat conditions");
            ent.setIconUrl("/icons/ent.png");
            specialtyRepository.save(ent);
        }
    }
} 