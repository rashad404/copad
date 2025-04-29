package com.drcopad.copad.controller;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.drcopad.copad.dto.MedicalProfileDTO;
import com.drcopad.copad.dto.UserProfileDTO;
import com.drcopad.copad.entity.User;
import com.drcopad.copad.repository.UserRepository;

import lombok.RequiredArgsConstructor;

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
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setAge(user.getAge());
        dto.setGender(user.getGender());
        dto.setFullName(user.getFullName());
        
        // Add roles to the DTO - strip the ROLE_ prefix if it exists
        Set<String> roles = user.getRoles().stream()
            .map(role -> role.startsWith("ROLE_") ? role.substring(5) : role)
            .collect(Collectors.toSet());
        dto.setRoles(roles);

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
