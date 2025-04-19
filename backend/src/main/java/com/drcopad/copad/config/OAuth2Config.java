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
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.beans.factory.annotation.Value;

import java.util.Arrays;
import java.util.List;
import java.util.function.Consumer;

@Component
public class OAuth2Config {

    private static final Logger logger = LoggerFactory.getLogger(OAuth2Config.class);

    @Value("${spring.profiles.active:local}")
    private String activeProfile;

    private final List<String> allowedDomains = Arrays.asList(
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

        logger.info("Creating OAuth2AuthorizationRequestResolver with base path: /oauth2/authorization");
        logger.info("Active profile: {}", activeProfile);
        
        resolver.setAuthorizationRequestCustomizer(authorizationRequestCustomizer());
        return resolver;
    }

    private Consumer<OAuth2AuthorizationRequest.Builder> authorizationRequestCustomizer() {
        return (builder) -> {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                String origin = request.getHeader("Origin");
                String referer = request.getHeader("Referer");
                
                logger.info("OAuth2 request details:");
                logger.info("Origin: {}", origin);
                logger.info("Referer: {}", referer);
                logger.info("Request URI: {}", request.getRequestURI());
                logger.info("Request URL: {}", request.getRequestURL());
                logger.info("Query String: {}", request.getQueryString());
                
                // Determine the base URL for redirect
                String baseUrl;
                if ("prod".equals(activeProfile)) {
                    baseUrl = "https://virtualhekim.az/api";
                    logger.info("Using production base URL: {}", baseUrl);
                } else {
                    baseUrl = "http://localhost:8080/api22";
                    logger.info("Using local base URL: {}", baseUrl);
                }
                
                // Construct the redirect URI
                String redirectUri = baseUrl + "/login/oauth2/code/google";
                logger.info("Setting redirect URI: {}", redirectUri);
                builder.redirectUri(redirectUri);
            }
            
            // Log the final authorization request
            OAuth2AuthorizationRequest finalRequest = builder.build();
            logger.info("Final OAuth2 Authorization Request:");
            logger.info("Authorization URI: {}", finalRequest.getAuthorizationUri());
            logger.info("Redirect URI: {}", finalRequest.getRedirectUri());
            logger.info("Scope: {}", finalRequest.getScopes());
            logger.info("State: {}", finalRequest.getState());
        };
    }
} 