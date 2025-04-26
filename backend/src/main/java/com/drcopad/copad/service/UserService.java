package com.drcopad.copad.service;

import com.drcopad.copad.dto.UserProfileDTO;
import com.drcopad.copad.dto.UserRegisterDTO;
import com.drcopad.copad.entity.User;
import com.drcopad.copad.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User register(UserRegisterDTO dto) {
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setAge(dto.getAge());
        user.setGender(dto.getGender());
        // Default role is USER
        user.setRoles(Collections.singleton("USER"));
        return userRepository.save(user);
    }
    
    public Page<UserProfileDTO> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(this::convertToProfileDTO);
    }
    
    public UserProfileDTO getUserProfileById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToProfileDTO(user);
    }
    
    @Transactional
    public UserProfileDTO updateUserRole(Long id, String role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Get current roles
        Set<String> roles = user.getRoles() != null ? 
                new HashSet<>(user.getRoles()) : new HashSet<>();
        
        switch (role.toUpperCase()) {
            case "ADMIN":
                roles.add("ADMIN");
                break;
            case "USER":
                roles.add("USER");
                break;
            case "REMOVE_ADMIN":
                roles.remove("ADMIN");
                // Ensure user still has at least USER role
                roles.add("USER");
                break;
            default:
                throw new IllegalArgumentException("Invalid role: " + role);
        }
        
        user.setRoles(roles);
        return convertToProfileDTO(userRepository.save(user));
    }
    
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Remove related entities first
        // This would depend on your specific entity relationships
        // Example: blogPostRepository.deleteByAuthor(user);
        
        userRepository.delete(user);
    }
    
    private UserProfileDTO convertToProfileDTO(User user) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setAge(user.getAge());
        dto.setGender(user.getGender());
        dto.setFullName(user.getFullName());
        
        // Add roles information
        if (user.getRoles() != null) {
            dto.setRoles(new HashSet<>(user.getRoles()));
        } else {
            dto.setRoles(Collections.singleton("USER"));
        }
        
        // Add medical profile if exists
        if (user.getMedicalProfile() != null) {
            // This part is already implemented elsewhere in your code
        }
        
        return dto;
    }
}