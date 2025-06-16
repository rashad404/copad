package com.drcopad.copad.config;

import java.util.Arrays;
import java.util.List;
import java.util.function.Consumer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;

@Component
public class OAuth2Config {

    private static final Logger logger = LoggerFactory.getLogger(OAuth2Config.class);

    private final List<String> allowedDomains = Arrays.asList(
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://192.168.1.105:3000",
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
                
                // Extract registration ID from the request path
                String requestPath = request.getRequestURI();
                String registrationId = null;
                if (requestPath != null && requestPath.contains("/oauth2/authorization/")) {
                    String[] parts = requestPath.split("/");
                    if (parts.length > 0) {
                        registrationId = parts[parts.length - 1];
                    }
                }
                
                if (registrationId != null && !registrationId.isEmpty()) {
                    String baseUrl = determineBaseUrl(request, origin, referer, forwardedProto, forwardedHost);
                    String redirectUri = baseUrl + "/api/login/oauth2/code/" + registrationId;
                    logger.info("Setting redirect URI to: {} for registration: {}", redirectUri, registrationId);
                    builder.redirectUri(redirectUri);
                } else {
                    logger.warn("No registration ID found in request path: {}", requestPath);
                }
            } else {
                logger.error("No request attributes found in RequestContextHolder");
            }
        };
    }
    
    private String determineBaseUrl(HttpServletRequest request, String origin, String referer, 
                                   String forwardedProto, String forwardedHost) {
        // If we have forwarded headers from a proxy/load balancer, use them
        if (forwardedProto != null && forwardedHost != null) {
            logger.info("Using forwarded headers - proto: {}, host: {}", forwardedProto, forwardedHost);
            return forwardedProto + "://" + forwardedHost;
        }
        
        // Try to determine from origin header
        if (origin != null && !origin.isEmpty()) {
            for (String allowedDomain : allowedDomains) {
                if (origin.startsWith(allowedDomain)) {
                    // Extract the base domain from origin
                    if (origin.contains("virtualhekim.az")) {
                        logger.info("Using origin domain: virtualhekim.az");
                        return "https://virtualhekim.az";
                    } else if (origin.contains("azdoc.ai")) {
                        logger.info("Using origin domain: azdoc.ai");
                        return "https://azdoc.ai";
                    } else if (origin.contains("logman.az")) {
                        logger.info("Using origin domain: logman.az");
                        return "https://logman.az";
                    }
                }
            }
        }
        
        // Try to determine from referer
        if (referer != null && !referer.isEmpty()) {
            if (referer.contains("virtualhekim.az")) {
                logger.info("Using referer domain: virtualhekim.az");
                return "https://virtualhekim.az";
            } else if (referer.contains("azdoc.ai")) {
                logger.info("Using referer domain: azdoc.ai");
                return "https://azdoc.ai";
            } else if (referer.contains("logman.az")) {
                logger.info("Using referer domain: logman.az");
                return "https://logman.az";
            }
        }
        
        // Check if this is localhost development
        String serverName = request.getServerName();
        int serverPort = request.getServerPort();
        if ("localhost".equals(serverName) || "127.0.0.1".equals(serverName) || 
            serverName.startsWith("192.168.")) {
            logger.info("Detected localhost/local network - serverName: {}, port: {}", serverName, serverPort);
            return "http://localhost:" + serverPort;
        }
        
        // Default to virtualhekim.az for production
        logger.info("Using default production domain: virtualhekim.az");
        return "https://virtualhekim.az";
    }
} 