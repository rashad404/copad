package com.drcopad.copad.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.OAuth2LoginAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

    private final JwtFilter jwtFilter;
    private final OAuth2Config oauth2Config;
    private final List<String> allowedDomains = Arrays.asList(
            "https://virtualhekim.az",
            "https://copad.ai",
            "https://logman.az"
    );

    @Value("${server.base-url}")
    private String baseUrl;

    public SecurityConfig(JwtFilter jwtFilter, OAuth2Config oauth2Config) {
        this.jwtFilter = jwtFilter;
        this.oauth2Config = oauth2Config;
    }

    @Bean
    public AuthenticationSuccessHandler oauth2AuthenticationSuccessHandler() {
        return new AuthenticationSuccessHandler() {
            @Override
            public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                    Authentication authentication) throws IOException, ServletException {
                logger.info("OAuth2 Authentication Success Handler");
                
                OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
                String email = oauth2User.getAttribute("email");
                String name = oauth2User.getAttribute("name");
                
                logger.info("Authenticated user email: {}", email);
                logger.info("Authenticated user name: {}", name);
                
                // Use the configured base URL for the frontend
                String redirectUrl = baseUrl.replace("/api", "") + "/auth/oauth2/success";
                logger.info("Redirecting to: {}", redirectUrl);
                response.sendRedirect(redirectUrl);
            }
        };
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, ClientRegistrationRepository clientRegistrationRepository) throws Exception {
        logger.info("Configuring SecurityFilterChain");
        
        return http
            .cors(cors -> {
                logger.info("Configuring CORS");
                cors.configurationSource(corsConfigurationSource());
            })
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> {
                logger.info("Configuring authorization rules");
                auth
                    .requestMatchers("/api/guest/**").permitAll()
                    .requestMatchers("/api/auth/**").permitAll()
                    .requestMatchers("/api/oauth2/authorization/**").permitAll()
                    .requestMatchers("/api/login/oauth2/code/**").permitAll()
                    .anyRequest().authenticated();
                logger.info("Authorization rules configured successfully");
            })
            .oauth2Login(oauth2 -> {
                logger.info("Configuring OAuth2 login");
                oauth2
                    .successHandler(oauth2AuthenticationSuccessHandler())
                    .failureUrl("/api/auth/failure")
                    .authorizationEndpoint(authorization -> {
                        logger.info("Setting up authorization endpoint with resolver");
                        authorization
                            .baseUri("/api/oauth2/authorization")
                            .authorizationRequestResolver(
                                oauth2Config.authorizationRequestResolver(clientRegistrationRepository)
                            );
                    })
                    .redirectionEndpoint(redirection -> {
                        logger.info("Configuring OAuth2 redirection endpoint");
                        redirection.baseUri("/api/login/oauth2/code/*");
                    });
                logger.info("OAuth2 login configuration completed");
            })
            .addFilterBefore(jwtFilter, OAuth2LoginAuthenticationFilter.class)
            .sessionManagement(session -> {
                logger.info("Configuring session management as STATELESS");
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
            })
            .formLogin(AbstractHttpConfigurer::disable)
            .httpBasic(AbstractHttpConfigurer::disable)
            .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(allowedDomains);
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "X-Requested-With",
            "Accept",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        logger.info("CORS Configuration:");
        logger.info("Allowed Origins: {}", allowedDomains);
        logger.info("Allowed Methods: {}", configuration.getAllowedMethods());
        logger.info("Allowed Headers: {}", configuration.getAllowedHeaders());
        logger.info("Allow Credentials: {}", configuration.getAllowCredentials());

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}