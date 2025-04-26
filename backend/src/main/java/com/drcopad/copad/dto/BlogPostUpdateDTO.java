package com.drcopad.copad.dto;

import java.util.Set;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BlogPostUpdateDTO {
    @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
    private String title;
    
    @Size(min = 10, max = 500, message = "Summary must be between 10 and 500 characters")
    private String summary;
    
    private String content;
    
    private Set<String> tagNames;
    
    private Boolean published;
    
    private String featuredImage;

    @Size(max = 5, message = "Language code must be at most 5 characters")
    private String language;
}