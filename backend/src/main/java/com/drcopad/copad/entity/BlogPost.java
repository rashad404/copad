package com.drcopad.copad.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import jakarta.validation.constraints.Pattern;

@Entity
@Data
public class BlogPost {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false, unique = true)
    @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$", message = "Slug must be URL-friendly (lowercase letters, numbers, and hyphens)")
    private String slug;
    
    @Column(nullable = false, length = 500)
    private String summary;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    private User author;
    
    @ManyToMany
    @JoinTable(
        name = "blog_post_tags",
        joinColumns = @JoinColumn(name = "blog_post_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new HashSet<>();
    
    @Column(nullable = false)
    private boolean published = false;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    private LocalDateTime publishedAt;
    
    @Column(nullable = false)
    @Pattern(regexp = "^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?$", message = "Invalid URL format")
    private String featuredImage;
    
    @Column(nullable = false)
    private int readingTimeMinutes;
    
    @PrePersist
    public void initializePost() {
        // Generate slug if not set
        if (this.slug == null || this.slug.isEmpty()) {
            this.slug = this.title.toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-|-$", "");
        }
        
        // Calculate reading time
        int wordsPerMinute = 200;
        int wordCount = content.split("\\s+").length;
        this.readingTimeMinutes = Math.max(1, (int) Math.ceil(wordCount / (double) wordsPerMinute));
    }
    
    @PreUpdate
    public void updateReadingTime() {
        int wordsPerMinute = 200;
        int wordCount = content.split("\\s+").length;
        this.readingTimeMinutes = Math.max(1, (int) Math.ceil(wordCount / (double) wordsPerMinute));
    }
}