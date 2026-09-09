package com.drcopad.copad.controller;

import com.drcopad.copad.config.SiteOrigin;
import com.drcopad.copad.dto.UserRegisterDTO;
import com.drcopad.copad.dto.UserLoginDTO;
import com.drcopad.copad.entity.User;
import com.drcopad.copad.repository.UserRepository;
import com.drcopad.copad.service.UserService;
import com.drcopad.copad.service.JwtService;
import com.drcopad.copad.dto.AuthResponse;
import com.drcopad.copad.service.AuthService;
import com.drcopad.copad.service.NativeAuthCodes;
import jakarta.servlet.http.Cookie;
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
import java.time.Duration;
import java.util.Map;
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
    private final NativeAuthCodes nativeCodes;

    /**
     * The app's own link, by build. Never taken from the request: echoing back
     * a caller's redirect target is how an open redirect is built, and this one
     * would carry a sign-in with it.
     */
    private static final Map<String, String> APP_SCHEMES = Map.of(
            "release", "azdoc://login/callback",
            "preview", "azdoc-preview://login/callback");

    /** Set before Google, read on the way back. Nothing else survives the trip. */
    private static final String NATIVE_COOKIE = "azdoc_native_auth";

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

    /**
     * Starts a sign-in for the app rather than the website.
     *
     * The app opens this in a system browser, we remember that it was the app
     * that asked and what it will have to prove later, and then the ordinary
     * Google flow runs. Everything about that flow is unchanged; only where it
     * ends is different.
     */
    @GetMapping("/native/start")
    public void startNativeLogin(@RequestParam String challenge,
                                 @RequestParam(defaultValue = "release") String variant,
                                 HttpServletResponse response) throws IOException {
        if (challenge.isBlank() || challenge.length() > 128
                || !APP_SCHEMES.containsKey(variant)) {
            response.sendError(HttpStatus.BAD_REQUEST.value(), "Bad sign-in request");
            return;
        }

        // A cookie because the Google round trip is the only way back and it
        // carries nothing of ours. Host-only, no JavaScript, and gone in five
        // minutes whether or not anybody comes back.
        Cookie cookie = new Cookie(NATIVE_COOKIE, variant + ":" + challenge);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setMaxAge((int) Duration.ofMinutes(5).toSeconds());
        cookie.setAttribute("SameSite", "Lax");
        response.addCookie(cookie);

        response.sendRedirect("/api/oauth2/authorization/google");
    }

    /**
     * Trades the code from the app's link for a session.
     *
     * The code arrived over a link any application on the phone could have
     * answered. The verifier did not: it never left the app that started this.
     */
    @PostMapping("/native/exchange")
    public ResponseEntity<?> exchangeNativeCode(@RequestBody NativeExchange body) {
        String email = nativeCodes.redeem(body.getCode(), body.getVerifier());
        if (email == null) {
            // Deliberately one answer for expired, spent, unknown and wrong.
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("That sign-in could not be completed. Please try again.");
        }
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        return ResponseEntity.ok(new AuthResponse(
                jwtService.generateToken(user.getEmail()), user.getName(), user.getEmail()));
    }

    @lombok.Data
    public static class NativeExchange {
        private String code;
        private String verifier;
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

        // The app, if it was the app that started this. The token stays here:
        // the link carries a code that is useless without the secret the app
        // kept, because any application on the phone can answer that link.
        String native_ = nativeRequest(request, response);
        if (native_ != null) {
            String variant = native_.substring(0, native_.indexOf(':'));
            String challenge = native_.substring(native_.indexOf(':') + 1);
            try {
                String code = nativeCodes.issue(authResponse.getEmail(), challenge);
                response.sendRedirect(APP_SCHEMES.get(variant) + "?code="
                        + URLEncoder.encode(code, StandardCharsets.UTF_8));
            } catch (IllegalStateException busy) {
                response.sendRedirect(APP_SCHEMES.get(variant) + "?error=busy");
            }
            return;
        }

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
    
    /**
     * The site to hand the browser back to after signing in.
     *
     * Resolved from the request. The old version looked at Origin and Referer,
     * but on the callback the referer is Google's own domain, so it always
     * chose the hardcoded default and moved people between our two domains
     * mid-login.
     */
    private String determineFrontendUrl(HttpServletRequest request) {
        return SiteOrigin.frontendOf(request);
    }

    /**
     * "variant:challenge" if the app started this, null for the website.
     *
     * Cleared as it is read, so a stale cookie cannot send somebody who later
     * signs in on the website off into an application instead.
     */
    private String nativeRequest(HttpServletRequest request, HttpServletResponse response) {
        if (request.getCookies() == null) return null;
        String value = null;
        for (Cookie cookie : request.getCookies()) {
            if (NATIVE_COOKIE.equals(cookie.getName())) value = cookie.getValue();
        }
        if (value == null) return null;

        Cookie clear = new Cookie(NATIVE_COOKIE, "");
        clear.setPath("/");
        clear.setHttpOnly(true);
        clear.setSecure(true);
        clear.setMaxAge(0);
        response.addCookie(clear);

        int split = value.indexOf(':');
        if (split <= 0 || split == value.length() - 1) return null;
        return APP_SCHEMES.containsKey(value.substring(0, split)) ? value : null;
    }
}