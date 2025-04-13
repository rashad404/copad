package com.drcopad.copad.controller;

import com.drcopad.copad.dto.UserRegisterDTO;
import com.drcopad.copad.dto.UserLoginDTO;
import com.drcopad.copad.entity.User;
import com.drcopad.copad.repository.UserRepository;
import com.drcopad.copad.service.UserService;
import com.drcopad.copad.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody UserRegisterDTO dto) {
        return ResponseEntity.ok(userService.register(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody UserLoginDTO dto) {
        User user = userRepository.findByEmail(dto.getEmail()).orElseThrow();
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
        String token = jwtService.generateToken(user.getEmail());
        return ResponseEntity.ok(token);
    }
}