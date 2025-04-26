package com.drcopad.copad.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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
    
    // Existing methods from current BlogService...
    
    // New admin-specific methods
    
    /**
     * Retrieves all posts for admin, including drafts
     */
    public Page<BlogPostListDTO> getAllPosts(Pageable pageable) {
        return blogPostRepository.findAll(pageable)
                .map(this::convertToListDTO);
    }
    
    /**
     * Get post by ID (for admin)
     */
    public BlogPostDTO getPostById(Long id) {
        BlogPost blogPost = blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog post not found"));
        return convertToDTO(blogPost);
    }
    
    /**
     * Get tag by ID (for admin)
     */
    public TagDTO getTagById(Long id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tag not found"));
        
        TagDTO dto = new TagDTO();
        dto.setId(tag.getId());
        dto.setName(tag.getName());
        dto.setSlug(tag.getSlug());
        dto.setPostCount(tag.getBlogPosts().size());
        
        return dto;
    }
    
    /**
     * Update tag (admin only)
     */
    @Transactional
    public TagDTO updateTag(Long id, String name) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tag not found"));
        
        // Check if the name is already used by another tag
        Optional<Tag> existingTag = tagRepository.findByName(name);
        if (existingTag.isPresent() && !existingTag.get().getId().equals(id)) {
            throw new RuntimeException("Tag name already exists");
        }
        
        tag.setName(name);
        
        // Update slug
        String slug = name.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", "")
                .replaceAll("\\s+", "-")
                .trim();
        
        // Check if slug already exists for another tag
        Optional<Tag> existingSlugTag = tagRepository.findBySlug(slug);
        if (existingSlugTag.isPresent() && !existingSlugTag.get().getId().equals(id)) {
            // Append a number to make slug unique
            int count = 1;
            String baseSlug = slug;
            while (tagRepository.findBySlug(slug).isPresent()) {
                slug = baseSlug + "-" + count;
                count++;
            }
        }
        
        tag.setSlug(slug);
        
        Tag updatedTag = tagRepository.save(tag);
        
        TagDTO dto = new TagDTO();
        dto.setId(updatedTag.getId());
        dto.setName(updatedTag.getName());
        dto.setSlug(updatedTag.getSlug());
        dto.setPostCount(updatedTag.getBlogPosts().size());
        
        return dto;
    }
    
    /**
     * Delete tag (admin only)
     */
    @Transactional
    public void deleteTag(Long id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tag not found"));
        
        // Remove tag from all blog posts
        for (BlogPost post : tag.getBlogPosts()) {
            post.getTags().remove(tag);
            blogPostRepository.save(post);
        }
        
        tagRepository.delete(tag);
    }
    
    /**
     * Get dashboard statistics
     */
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalPosts = blogPostRepository.count();
        long publishedPosts = blogPostRepository.countByPublishedTrue();
        long draftPosts = totalPosts - publishedPosts;
        long totalTags = tagRepository.count();
        long totalUsers = userRepository.count();
        
        stats.put("totalPosts", totalPosts);
        stats.put("publishedPosts", publishedPosts);
        stats.put("draftPosts", draftPosts);
        stats.put("totalTags", totalTags);
        stats.put("totalUsers", totalUsers);
        
        // Placeholder for views - in a real application, you would track this
        stats.put("totalViews", 0);
        
        return stats;
    }
    
    /**
     * Get recent posts for dashboard
     */
    public List<BlogPostListDTO> getRecentPosts(int limit) {
        return blogPostRepository.findTop10ByOrderByCreatedAtDesc()
                .stream()
                .limit(limit)
                .map(this::convertToListDTO)
                .collect(Collectors.toList());
    }
    
    // Helper methods (some may already exist in your current service)
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