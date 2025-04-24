package com.drcopad.copad.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
public class BlogPostListDTO {
    private Long id;
    private String title;
    private String slug;
    private String summary;
    private UserProfileDTO author;
    private Set<TagDTO> tags;
    private LocalDateTime publishedAt;
    private String featuredImage;
    private int readingTimeMinutes;
}