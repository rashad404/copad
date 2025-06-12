package com.drcopad.copad.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    @Value("${upload.base-dir}")
    private String uploadBaseDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Convert relative path to absolute path
        Path uploadPath = Paths.get(uploadBaseDir).toAbsolutePath().normalize();
        String uploadDir = "file:///" + uploadPath.toString() + "/";

        // Serve /uploads/** from the upload base directory
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadDir)
                .setCachePeriod(3600); // Cache for 1 hour
                
        System.out.println("Configured static resources:");
        System.out.println("  Handler: /uploads/**");
        System.out.println("  Location: " + uploadDir);
    }
}