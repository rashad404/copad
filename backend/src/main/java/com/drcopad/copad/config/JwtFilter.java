package com.drcopad.copad.config;

import com.drcopad.copad.entity.User;
import com.drcopad.copad.repository.UserRepository;
import com.drcopad.copad.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collection;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    private static final Logger log = LoggerFactory.getLogger(JwtFilter.class);

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        boolean shouldNotFilter = PublicEndpoints.PUBLIC_URLS.stream()
                .anyMatch(publicUrl -> pathMatcher.match(publicUrl, path));
        if (shouldNotFilter) {
            log.trace("Path {} is public, skipping JWT filter.", path);
        }
            log.info("Checking shouldNotFilter for path '{}': {}", path, shouldNotFilter); // ADD THIS LOG

        return shouldNotFilter;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;
            log.info("Inside JWTFilter doFilterInternal");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.trace("No JWT token found in request header for path: {}", request.getRequestURI());
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        log.debug("Extracted JWT: {}", jwt);

        try {
            userEmail = jwtService.extractUsername(jwt);
            log.debug("Extracted username from JWT: {}", userEmail);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                log.debug("No existing authentication found in security context.");

                var userOptional = userRepository.findByEmail(userEmail);

                if (userOptional.isPresent()) {
                    User userDetails = userOptional.get();
                    log.debug("User found in database: ID={}, Email={}, Raw Roles={}",
                            userDetails.getId(), userDetails.getEmail(), userDetails.getRoles());

                    if (jwtService.isTokenValid(jwt, userDetails)) {
                        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
                        log.debug("Authorities generated for user {}: {}", userEmail, authorities);

                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                authorities
                        );

                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                        log.info("Successfully authenticated user '{}' with authorities: {}", userEmail, SecurityContextHolder.getContext().getAuthentication().getAuthorities());
                    } else {
                        log.warn("JWT token is invalid for user: {}", userEmail);
                    }
                } else {
                    log.warn("User not found in database for email extracted from JWT: {}", userEmail);
                }
            } else if (userEmail != null) {
                log.debug("Security context already contains authentication for user: {}", userEmail);
            }
        } catch (Exception e) {
            log.error("Error processing JWT token: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}