package com.drcopad.copad.controller;

import com.drcopad.copad.dto.MedicalProfileDTO;
import com.drcopad.copad.dto.UserProfileDTO;
import com.drcopad.copad.entity.MedicalProfile;
import com.drcopad.copad.entity.User;
import com.drcopad.copad.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<UserProfileDTO> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // Subject (email) from token

        // Always reload from DB
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        UserProfileDTO dto = new UserProfileDTO();
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setAge(user.getAge());
        dto.setGender(user.getGender());

        if (user.getMedicalProfile() != null) {
            MedicalProfileDTO m = new MedicalProfileDTO();
            m.setHeight(user.getMedicalProfile().getHeight());
            m.setWeight(user.getMedicalProfile().getWeight());
            m.setConditions(user.getMedicalProfile().getConditions());
            m.setAllergies(user.getMedicalProfile().getAllergies());
            m.setMedications(user.getMedicalProfile().getMedications());
            m.setLifestyle(user.getMedicalProfile().getLifestyle());
            dto.setMedicalProfile(m);
        }

        return ResponseEntity.ok(dto);
    }

    @PutMapping
    public ResponseEntity<User> updateProfile(@AuthenticationPrincipal User user,
                                              @RequestBody User updated) {
        user.setName(updated.getName());
        user.setEmail(updated.getEmail());
        user.setAge(updated.getAge());
        user.setGender(updated.getGender());

        // Update medical profile
        if (user.getMedicalProfile() == null) {
            user.setMedicalProfile(new MedicalProfile());
        }

        MedicalProfile m = user.getMedicalProfile();
        MedicalProfile updatedM = updated.getMedicalProfile();

        m.setHeight(updatedM.getHeight());
        m.setWeight(updatedM.getWeight());
        m.setConditions(updatedM.getConditions());
        m.setAllergies(updatedM.getAllergies());
        m.setMedications(updatedM.getMedications());
        m.setLifestyle(updatedM.getLifestyle());

        return ResponseEntity.ok(userRepository.save(user));
    }
}
