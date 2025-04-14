package com.drcopad.copad.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.List;
import java.util.function.Consumer;

@Component
public class OAuth2Config {

    private static final Logger logger = LoggerFactory.getLogger(OAuth2Config.class);

    private final List<String> allowedDomains = Arrays.asList(
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://virtualhekim.az",
        "https://copad.ai",
        "https://logman.az"
    );

    public OAuth2AuthorizationRequestResolver authorizationRequestResolver(
            ClientRegistrationRepository clientRegistrationRepository) {
        
        DefaultOAuth2AuthorizationRequestResolver resolver = 
            new DefaultOAuth2AuthorizationRequestResolver(
                clientRegistrationRepository, 
                "/oauth2/authorization"
            );

        resolver.setAuthorizationRequestCustomizer(authorizationRequestCustomizer());
        return resolver;
    }

    private Consumer<OAuth2AuthorizationRequest.Builder> authorizationRequestCustomizer() {
        return (builder) -> {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                String origin = request.getHeader("Origin");
                logger.info("OAuth2 request received from origin: {}", origin);
                
                if (origin != null && allowedDomains.contains(origin)) {
                    String registrationId = request.getParameter("registration_id");
                    logger.info("Registration ID: {}", registrationId);
                    
                    if (registrationId != null) {
                        String redirectUri = origin + "/login/oauth2/code/" + registrationId;
                        logger.info("Setting redirect URI to: {}", redirectUri);
                        builder.redirectUri(redirectUri);
                    }
                } else {
                    logger.warn("Origin not allowed or not present: {}", origin);
                }
            } else {
                logger.error("No request attributes found in RequestContextHolder");
            }
        };
    }
} 