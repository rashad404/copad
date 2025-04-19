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

        logger.info("Creating OAuth2AuthorizationRequestResolver with base path: /oauth2/authorization");
        
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
                String userAgent = request.getHeader("User-Agent");
                
                logger.info("OAuth2 request details:");
                logger.info("Origin: {}", origin);
                logger.info("Referer: {}", referer);
                logger.info("User-Agent: {}", userAgent);
                logger.info("Request URI: {}", request.getRequestURI());
                logger.info("Request URL: {}", request.getRequestURL());
                logger.info("Query String: {}", request.getQueryString());
                logger.info("Current builder redirect URI: {}", builder.build().getRedirectUri());
                
                if (origin != null && allowedDomains.contains(origin)) {
                    String registrationId = request.getParameter("registration_id");
                    logger.info("Registration ID from parameter: {}", registrationId);
                    
                    if (registrationId != null) {
                        String redirectUri = origin + "/login3/oauth2/code/" + registrationId;
                        logger.info("Setting custom redirect URI to: {}", redirectUri);
                        builder.redirectUri(redirectUri);
                    } else {
                        logger.warn("No registration_id parameter found in request");
                    }
                } else {
                    logger.warn("Origin not allowed or not present: {}", origin);
                    logger.info("Allowed domains: {}", allowedDomains);
                }
            } else {
                logger.error("No request attributes found in RequestContextHolder");
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