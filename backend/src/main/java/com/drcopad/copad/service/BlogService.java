package com.drcopad.copad.service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.drcopad.copad.dto.BlogPostCreateDTO;
import com.drcopad.copad.dto.BlogPostDTO;
import com.drcopad.copad.dto.BlogPostListDTO;
import com.drcopad.copad.dto.BlogPostUpdateDTO;
import com.drcopad.copad.dto.TagDTO;
import com.drcopad.copad.dto.UserProfileDTO;
import com.drcopad.copad.entity.BlogPost;
import com.drcopad.copad.entity.Tag;
import com.drcopad.copad.entity.User;
import com.drcopad.copad.repository.BlogPostRepository;
import com.drcopad.copad.repository.TagRepository;
import com.drcopad.copad.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BlogService {

    private final BlogPostRepository blogPostRepository;
    private final TagService tagService;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    
    public Page<BlogPostListDTO> getAllPublishedPosts(Pageable pageable, String language) {
        return blogPostRepository.findAllByPublishedTrueAndLanguage(language, pageable)
                .map(this::convertToListDTO);
    }
    
    public BlogPostDTO getPostBySlug(String slug) {
        BlogPost blogPost = blogPostRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Blog post not found"));
        return convertToDTO(blogPost);
    }

    public Page<BlogPostListDTO> getPostsByTag(String tagSlug, Pageable pageable, String language) {
        Tag tag = tagRepository.findBySlug(tagSlug)
                .orElseThrow(() -> new RuntimeException("Tag not found"));
        return blogPostRepository.findByTagAndPublishedTrueAndLanguage(tag, language, pageable)
                .map(this::convertToListDTO);
    }
    
    @Transactional
    public BlogPostDTO createPost(BlogPostCreateDTO createDTO, Long authorId) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        BlogPost blogPost = new BlogPost();
        blogPost.setTitle(createDTO.getTitle());
        blogPost.setSlug(createSlug(createDTO.getTitle()));
        blogPost.setSummary(createDTO.getSummary());
        blogPost.setContent(createDTO.getContent());
        blogPost.setAuthor(author);
        blogPost.setPublished(createDTO.isPublished());
        blogPost.setFeaturedImage(createDTO.getFeaturedImage());
        blogPost.setReadingTimeMinutes(calculateReadingTime(createDTO.getContent()));
        blogPost.setLanguage(createDTO.getLanguage() != null ? createDTO.getLanguage() : "en");
        
        if (createDTO.isPublished()) {
            blogPost.setPublishedAt(LocalDateTime.now());
        }
        
        // Handle tags
        if (createDTO.getTagNames() != null && !createDTO.getTagNames().isEmpty()) {
            Set<Tag> tags = new HashSet<>();
            for (String tagName : createDTO.getTagNames()) {
                Tag tag = tagService.getOrCreateTag(tagName);
                tags.add(tag);
            }
            blogPost.setTags(tags);
        }
        
        BlogPost savedPost = blogPostRepository.save(blogPost);
        return convertToDTO(savedPost);
    }
    
    @Transactional
    public BlogPostDTO updatePost(Long postId, BlogPostUpdateDTO updateDTO, Long authorId) {
        BlogPost blogPost = blogPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Blog post not found"));
        
        // Ensure author is allowed to update this post
        if (!blogPost.getAuthor().getId().equals(authorId)) {
            throw new RuntimeException("Not authorized to update this post");
        }
        
        // Update fields if provided
        if (updateDTO.getTitle() != null) {
            blogPost.setTitle(updateDTO.getTitle());
            // Only update slug if title changes
            blogPost.setSlug(createSlug(updateDTO.getTitle()));
        }
        
        if (updateDTO.getSummary() != null) {
            blogPost.setSummary(updateDTO.getSummary());
        }
        
        if (updateDTO.getContent() != null) {
            blogPost.setContent(updateDTO.getContent());
            blogPost.setReadingTimeMinutes(calculateReadingTime(updateDTO.getContent()));
        }
        
        if (updateDTO.getFeaturedImage() != null) {
            blogPost.setFeaturedImage(updateDTO.getFeaturedImage());
        }
        
        // Handle publishing state
        if (updateDTO.getPublished() != null) {
            boolean wasPublished = blogPost.isPublished();
            blogPost.setPublished(updateDTO.getPublished());
            
            // Set publishedAt only on first publish
            if (!wasPublished && updateDTO.getPublished()) {
                blogPost.setPublishedAt(LocalDateTime.now());
            }
        }
        
        // Handle tags
        if (updateDTO.getTagNames() != null) {
            Set<Tag> tags = new HashSet<>();
            for (String tagName : updateDTO.getTagNames()) {
                Tag tag = tagService.getOrCreateTag(tagName);
                tags.add(tag);
            }
            blogPost.setTags(tags);
        }
        
        if (updateDTO.getLanguage() != null) {
            blogPost.setLanguage(updateDTO.getLanguage());
        }
        
        BlogPost updatedPost = blogPostRepository.save(blogPost);
        return convertToDTO(updatedPost);
    }
    
    public void deletePost(Long postId, Long authorId) {
        BlogPost blogPost = blogPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Blog post not found"));
        
        // Ensure author is allowed to delete this post
        if (!blogPost.getAuthor().getId().equals(authorId)) {
            throw new RuntimeException("Not authorized to delete this post");
        }
        
        blogPostRepository.delete(blogPost);
    }
    
    public Page<BlogPostListDTO> searchPosts(String keyword, Pageable pageable, String language) {
        return blogPostRepository.searchByKeywordAndLanguage(keyword, language, pageable)
                .map(this::convertToListDTO);
    }
    
    private String createSlug(String title) {
        // Basic slug creation - lowercase, replace spaces with hyphens
        String slug = title.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", "")
                .replaceAll("\\s+", "-");
        
        // Check if slug already exists and append a number if needed
        String baseSlug = slug;
        int count = 1;
        while (blogPostRepository.findBySlug(slug).isPresent()) {
            slug = baseSlug + "-" + count;
            count++;
        }
        
        return slug;
    }
    
    private int calculateReadingTime(String content) {
        // Average reading speed: 200-250 words per minute
        // We'll use 225 words per minute as average
        if (content == null || content.isBlank()) {
            return 1; // Minimum reading time
        }
        
        int wordCount = content.split("\\s+").length;
        int minutes = wordCount / 225;
        
        return Math.max(1, minutes); // At least 1 minute
    }
    
    private BlogPostDTO convertToDTO(BlogPost blogPost) {
        BlogPostDTO dto = new BlogPostDTO();
        dto.setId(blogPost.getId());
        dto.setTitle(blogPost.getTitle());
        dto.setSlug(blogPost.getSlug());
        dto.setSummary(blogPost.getSummary());
        dto.setContent(blogPost.getContent());
        
        // Set author
        UserProfileDTO authorDTO = new UserProfileDTO();
        authorDTO.setId(blogPost.getAuthor().getId());
        authorDTO.setFullName(blogPost.getAuthor().getFullName());
        dto.setAuthor(authorDTO);
        
        // Set tags
        dto.setTags(blogPost.getTags().stream()
                .map(tag -> {
                    TagDTO tagDTO = new TagDTO();
                    tagDTO.setId(tag.getId());
                    tagDTO.setName(tag.getName());
                    tagDTO.setSlug(tag.getSlug());
                    return tagDTO;
                })
                .collect(Collectors.toSet()));
        
        dto.setPublished(blogPost.isPublished());
        dto.setCreatedAt(blogPost.getCreatedAt());
        dto.setUpdatedAt(blogPost.getUpdatedAt());
        dto.setPublishedAt(blogPost.getPublishedAt());
        dto.setFeaturedImage(blogPost.getFeaturedImage());
        dto.setReadingTimeMinutes(blogPost.getReadingTimeMinutes());
        dto.setLanguage(blogPost.getLanguage());
        
        return dto;
    }
    
    private BlogPostListDTO convertToListDTO(BlogPost blogPost) {
        BlogPostListDTO dto = new BlogPostListDTO();
        dto.setId(blogPost.getId());
        dto.setTitle(blogPost.getTitle());
        dto.setSlug(blogPost.getSlug());
        dto.setSummary(blogPost.getSummary());
        
        // Set author
        UserProfileDTO authorDTO = new UserProfileDTO();
        authorDTO.setId(blogPost.getAuthor().getId());
        authorDTO.setFullName(blogPost.getAuthor().getFullName());
        dto.setAuthor(authorDTO);
        
        // Set tags
        dto.setTags(blogPost.getTags().stream()
                .map(tag -> {
                    TagDTO tagDTO = new TagDTO();
                    tagDTO.setId(tag.getId());
                    tagDTO.setName(tag.getName());
                    tagDTO.setSlug(tag.getSlug());
                    return tagDTO;
                })
                .collect(Collectors.toSet()));
        
        dto.setPublishedAt(blogPost.getPublishedAt());
        dto.setFeaturedImage(blogPost.getFeaturedImage());
        dto.setReadingTimeMinutes(blogPost.getReadingTimeMinutes());
        dto.setLanguage(blogPost.getLanguage());
        
        return dto;
    }
}