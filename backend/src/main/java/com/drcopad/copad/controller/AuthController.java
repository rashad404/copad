package com.drcopad.copad.controller;

import com.drcopad.copad.dto.UserRegisterDTO;
import com.drcopad.copad.dto.UserLoginDTO;
import com.drcopad.copad.entity.User;
import com.drcopad.copad.repository.UserRepository;
import com.drcopad.copad.service.UserService;
import com.drcopad.copad.service.JwtService;
import com.drcopad.copad.dto.AuthResponse;
import com.drcopad.copad.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import jakarta.servlet.http.HttpServletRequest;

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
    public ResponseEntity<String> register(@RequestBody UserRegisterDTO dto) {
        User user = userService.register(dto);
        String token = jwtService.generateToken(user.getEmail());
        return ResponseEntity.ok(token);
    }


    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody UserLoginDTO dto, HttpServletRequest request, HttpServletResponse response) {
        try {
            // Clear any existing security context
            SecurityContextHolder.clearContext();
            new SecurityContextLogoutHandler().logout(request, response, null);
            
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

    @PostMapping("/logout") 
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Logged out successfully");
    }

    @RequestMapping(value = "/success", method = {RequestMethod.GET, RequestMethod.POST})
    public void handleOAuthSuccess(@AuthenticationPrincipal OAuth2User oauth2User,
                                    HttpServletResponse response,
                                    HttpServletRequest request) throws IOException {
        if (oauth2User == null) {
            response.sendError(HttpStatus.UNAUTHORIZED.value(), "Unauthorized");
            return;
        }

        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");

        if (email == null || name == null) {
            response.sendError(HttpStatus.BAD_REQUEST.value(), "Missing user information");
            return;
        }

        // Create token
        AuthResponse authResponse = authService.handleOAuthLogin(email, name);

        // Logout user to clear session immediately after creating JWT
        new SecurityContextLogoutHandler().logout(request, response, null);

        // Determine the frontend URL based on the request
        String frontendUrl = determineFrontendUrl(request);
        
        // Redirect to frontend with token
        String redirectUrl = String.format("%s/login/callback?token=%s&name=%s&email=%s",
                frontendUrl,
                URLEncoder.encode(authResponse.getToken(), StandardCharsets.UTF_8),
                URLEncoder.encode(authResponse.getFullName(), StandardCharsets.UTF_8),
                URLEncoder.encode(authResponse.getEmail(), StandardCharsets.UTF_8));
        response.sendRedirect(redirectUrl);
    }
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Auth endpoint is working");
    }

    @GetMapping("/failure")
    public void handleOAuthFailure(HttpServletResponse response,
                                   HttpServletRequest request) throws IOException {
        // Log the failure for debugging
        String error = request.getParameter("error");
        String errorDescription = request.getParameter("error_description");
        
        System.err.println("OAuth2 login failed - Error: " + error + ", Description: " + errorDescription);
        
        // Redirect to frontend login page with error
        String frontendUrl = determineFrontendUrl(request);
        String redirectUrl = frontendUrl + "/login?error=oauth_failed";
        if (error != null) {
            redirectUrl += "&reason=" + URLEncoder.encode(error, StandardCharsets.UTF_8);
        }
        response.sendRedirect(redirectUrl);
    }
    
    private String determineFrontendUrl(HttpServletRequest request) {
        String referer = request.getHeader("Referer");
        String origin = request.getHeader("Origin");
        String forwardedProto = request.getHeader("X-Forwarded-Proto");
        String forwardedHost = request.getHeader("X-Forwarded-Host");
        
        // Check for localhost development
        String serverName = request.getServerName();
        if ("localhost".equals(serverName) || "127.0.0.1".equals(serverName)) {
            // For local development, use port 3000 (Next.js default)
            return "http://localhost:3000";
        }
        
        // For production, use the forwarded headers or default to the known domain
        if (forwardedProto != null && forwardedHost != null) {
            return forwardedProto + "://" + forwardedHost;
        }
        
        return "https://virtualhekim.az";
    }
}