package com.drcopad.copad.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.List;
import java.util.function.Consumer;
import java.net.URL;

@Component
public class OAuth2Config {

    private static final Logger logger = LoggerFactory.getLogger(OAuth2Config.class);

    private final List<String> allowedDomains = Arrays.asList(
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://virtualhekim.az",
        "https://azdoc.ai",
        "https://logman.az"
    );

    public OAuth2UserService<OAuth2UserRequest, OAuth2User> oauth2UserService() {
        return new DefaultOAuth2UserService();
    }

    public OAuth2AuthorizationRequestResolver authorizationRequestResolver(
            ClientRegistrationRepository clientRegistrationRepository) {
        
        DefaultOAuth2AuthorizationRequestResolver resolver = 
            new DefaultOAuth2AuthorizationRequestResolver(
                clientRegistrationRepository, 
                "/api/oauth2/authorization"
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
                String referer = request.getHeader("Referer");
                String forwardedProto = request.getHeader("X-Forwarded-Proto");
                String forwardedHost = request.getHeader("X-Forwarded-Host");
                
                logger.info("OAuth2 request received - Origin: {}, Referer: {}, ForwardedProto: {}, ForwardedHost: {}, URL: {}", 
                    origin, referer, forwardedProto, forwardedHost, request.getRequestURL());
                
                // Always set the redirect URI to the production domain
                String registrationId = request.getParameter("registration_id");
                if (registrationId != null) {
                    String baseUrl = "https://virtualhekim.az";
                    if (forwardedProto != null && forwardedHost != null) {
                        baseUrl = forwardedProto + "://" + forwardedHost;
                    }
                    String redirectUri = baseUrl + "/api/login/oauth2/code/" + registrationId;
                    logger.info("Setting redirect URI to: {}", redirectUri);
                    builder.redirectUri(redirectUri);
                }
            } else {
                logger.error("No request attributes found in RequestContextHolder");
            }
        };
    }
} 