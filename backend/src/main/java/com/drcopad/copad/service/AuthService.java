package com.drcopad.copad.service;

import com.drcopad.copad.dto.AuthResponse;
import com.drcopad.copad.entity.User;
import com.drcopad.copad.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    public AuthResponse handleOAuthLogin(String email, String name) {
        User user = userRepository.findByEmail(email)
            .orElseGet(() -> {
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setName(name);
                newUser.setPassword(""); // OAuth users don't need password
                return userRepository.save(newUser);
            });

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token, user.getName(), user.getEmail());
    }
} 