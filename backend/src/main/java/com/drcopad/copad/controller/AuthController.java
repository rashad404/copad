package com.drcopad.copad.controller;

import com.drcopad.copad.dto.UserRegisterDTO;
import com.drcopad.copad.dto.UserLoginDTO;
import com.drcopad.copad.entity.User;
import com.drcopad.copad.repository.UserRepository;
import com.drcopad.copad.service.UserService;
import com.drcopad.copad.service.JwtService;
import com.drcopad.copad.dto.AuthResponse;
import com.drcopad.copad.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody UserRegisterDTO dto) {
        return ResponseEntity.ok(userService.register(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody UserLoginDTO dto) {
        try {
            User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
                
            if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }
            
            String token = jwtService.generateToken(user.getEmail());
            return ResponseEntity.ok(token);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        }
    }

    @GetMapping("/success")
    @PostMapping("/success")
    public ResponseEntity<AuthResponse> handleOAuthSuccess(@AuthenticationPrincipal OAuth2User oauth2User) {
        if (oauth2User == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        
        if (email == null || name == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        
        // Check if user exists, if not create new user
        AuthResponse response = authService.handleOAuthLogin(email, name);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Auth endpoint is working");
    }
}