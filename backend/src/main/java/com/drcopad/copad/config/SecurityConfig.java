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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

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

    public SecurityConfig(JwtFilter jwtFilter, OAuth2Config oauth2Config) {
        this.jwtFilter = jwtFilter;
        this.oauth2Config = oauth2Config;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, ClientRegistrationRepository clientRegistrationRepository) throws Exception {
        logger.info("Configuring SecurityFilterChain");
        
        http
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
                    .anyRequest().authenticated();
            })
            .oauth2Login(oauth2 -> {
                logger.info("Configuring OAuth2 login");
                oauth2
                    .defaultSuccessUrl("/api/auth/success")
                    .failureUrl("/api/auth/failure")
                    .authorizationEndpoint(authorization -> {
                        logger.info("Setting up authorization endpoint with resolver");
                        authorization
                            .authorizationRequestResolver(
                                oauth2Config.authorizationRequestResolver(clientRegistrationRepository)
                            );
                    });
            })
            .addFilterBefore(jwtFilter, OAuth2LoginAuthenticationFilter.class)
            .sessionManagement(session -> {
                logger.info("Configuring session management as STATELESS");
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
            })
            .formLogin(AbstractHttpConfigurer::disable)
            .httpBasic(AbstractHttpConfigurer::disable);

        logger.info("SecurityFilterChain configuration completed");
        return http.build();
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