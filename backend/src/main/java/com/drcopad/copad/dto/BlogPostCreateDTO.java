package com.drcopad.copad.dto;

import java.util.Set;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BlogPostCreateDTO {
    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
    private String title;
    
    @NotBlank(message = "Summary is required")
    @Size(min = 10, max = 500, message = "Summary must be between 10 and 500 characters")
    private String summary;
    
    @NotBlank(message = "Content is required")
    private String content;
    
    private Set<String> tagNames;
    
    private boolean published;
    
    @NotBlank(message = "Featured image URL is required")
    private String featuredImage;

    @NotBlank(message = "Language is required")
    @Size(max = 5, message = "Language code must be at most 5 characters")
    private String language;
}