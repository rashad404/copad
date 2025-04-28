package com.drcopad.copad.controller;

import com.drcopad.copad.dto.MedicalProfileDTO;
import com.drcopad.copad.dto.UserProfileDTO;
import com.drcopad.copad.entity.User;
import com.drcopad.copad.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<UserProfileDTO> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email;
        Object principal = authentication.getPrincipal();
        if (principal instanceof User user) {
            email = user.getEmail(); // from authenticated User
        } else if (principal instanceof String username) {
            email = username; // fallback if principal is email directly
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid authentication principal");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        UserProfileDTO dto = new UserProfileDTO();
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setAge(user.getAge());
        dto.setGender(user.getGender());
        dto.setFullName(user.getFullName());

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

}
