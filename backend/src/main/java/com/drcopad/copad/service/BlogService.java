package com.drcopad.copad.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
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
    
    @Value("${upload.dir}")
    private String uploadDir;

    private static final Logger log = LoggerFactory.getLogger(BlogService.class);

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

        // Delete associated image files if they exist
        if (blogPost.getFeaturedImage() != null && !blogPost.getFeaturedImage().isEmpty()) {
            try {
                // Extract filename from the URL
                String imageUrl = blogPost.getFeaturedImage();
                String filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
                
                // Delete original image
                Path imagePath = Paths.get(uploadDir, filename);
                if (Files.exists(imagePath)) {
                    Files.delete(imagePath);
                }
                
                // Delete thumbnail
                Path thumbPath = Paths.get(uploadDir, "thumbs", filename);
                if (Files.exists(thumbPath)) {
                    Files.delete(thumbPath);
                }
            } catch (IOException e) {
                // Log the error but don't fail the deletion
                log.error("Failed to delete image files for post {}: {}", postId, e.getMessage());
            }
        }
        
        blogPostRepository.delete(blogPost);
    }
    
    public Page<BlogPostListDTO> searchPosts(String keyword, Pageable pageable, String language) {
        return blogPostRepository.searchByKeywordAndLanguage(keyword, language, pageable)
                .map(this::convertToListDTO);
    }
    
private String createSlug(String title) {
    // Replace Turkish characters with English equivalents
    String slugText = title;
    slugText = slugText.replace("ə", "e").replace("ü", "u").replace("ç", "c")
               .replace("ş", "s").replace("ı", "i").replace("ö", "o").replace("ğ", "g")
               .replace("Ə", "E").replace("Ü", "U").replace("Ç", "C")
               .replace("Ş", "S").replace("I", "I").replace("Ö", "O").replace("Ğ", "G");
    
    // Create slug - lowercase, remove special chars, replace spaces with hyphens
    String slug = slugText.toLowerCase()
               .replaceAll("[^a-z0-9\\s]", "") // Remove all non-alphanumeric chars except spaces
               .replaceAll("\\s+", "-")        // Replace spaces with hyphens
               .replaceAll("-+", "-")          // Replace multiple hyphens with single hyphen
               .trim();
    
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
    
//    private BlogPostDTO convertToDTO(BlogPost blogPost) {
//        BlogPostDTO dto = new BlogPostDTO();
//        dto.setId(blogPost.getId());
//        dto.setTitle(blogPost.getTitle());
//        dto.setSlug(blogPost.getSlug());
//        dto.setSummary(blogPost.getSummary());
//        dto.setContent(blogPost.getContent());
//
//        // Set author
//        UserProfileDTO authorDTO = new UserProfileDTO();
//        authorDTO.setId(blogPost.getAuthor().getId());
//        authorDTO.setFullName(blogPost.getAuthor().getFullName());
//        dto.setAuthor(authorDTO);
//
//        // Set tags
//        dto.setTags(blogPost.getTags().stream()
//                .map(tag -> {
//                    TagDTO tagDTO = new TagDTO();
//                    tagDTO.setId(tag.getId());
//                    tagDTO.setName(tag.getName());
//                    tagDTO.setSlug(tag.getSlug());
//                    return tagDTO;
//                })
//                .collect(Collectors.toSet()));
//
//        dto.setPublished(blogPost.isPublished());
//        dto.setCreatedAt(blogPost.getCreatedAt());
//        dto.setUpdatedAt(blogPost.getUpdatedAt());
//        dto.setPublishedAt(blogPost.getPublishedAt());
//        dto.setFeaturedImage(blogPost.getFeaturedImage());
//        dto.setReadingTimeMinutes(blogPost.getReadingTimeMinutes());
//        dto.setLanguage(blogPost.getLanguage());
//
//        return dto;
//    }
//
//    private BlogPostListDTO convertToListDTO(BlogPost blogPost) {
//        BlogPostListDTO dto = new BlogPostListDTO();
//        dto.setId(blogPost.getId());
//        dto.setTitle(blogPost.getTitle());
//        dto.setSlug(blogPost.getSlug());
//        dto.setSummary(blogPost.getSummary());
//
//        // Set author
//        UserProfileDTO authorDTO = new UserProfileDTO();
//        authorDTO.setId(blogPost.getAuthor().getId());
//        authorDTO.setFullName(blogPost.getAuthor().getFullName());
//        dto.setAuthor(authorDTO);
//
//        // Set tags
//        dto.setTags(blogPost.getTags().stream()
//                .map(tag -> {
//                    TagDTO tagDTO = new TagDTO();
//                    tagDTO.setId(tag.getId());
//                    tagDTO.setName(tag.getName());
//                    tagDTO.setSlug(tag.getSlug());
//                    return tagDTO;
//                })
//                .collect(Collectors.toSet()));
//
//        dto.setPublishedAt(blogPost.getPublishedAt());
//        dto.setFeaturedImage(blogPost.getFeaturedImage());
//        dto.setReadingTimeMinutes(blogPost.getReadingTimeMinutes());
//        dto.setLanguage(blogPost.getLanguage());
//
//        return dto;
//    }
    
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

    /**
     * Create a new tag (admin only)
     */
    public TagDTO createTag(String name) {
        // Check if tag already exists
        if (tagRepository.existsByName(name)) {
            throw new RuntimeException("Tag with name '" + name + "' already exists");
        }
        
        // Create and save new tag
        Tag tag = new Tag();
        tag.setName(name);
        
        // Create slug
        String slug = name.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", "")
                .replaceAll("\\s+", "-")
                .trim();
        
        // Check if slug already exists
        String baseSlug = slug;
        int count = 1;
        while (tagRepository.findBySlug(slug).isPresent()) {
            slug = baseSlug + "-" + count;
            count++;
        }
        
        tag.setSlug(slug);
        
        Tag savedTag = tagRepository.save(tag);
        
        // Convert to DTO
        TagDTO dto = new TagDTO();
        dto.setId(savedTag.getId());
        dto.setName(savedTag.getName());
        dto.setSlug(savedTag.getSlug());
        dto.setPostCount(0); // New tag, no posts yet
        
        return dto;
    }

    /**
     * Get all tags (currently used by public and admin endpoints)
     */
    public List<TagDTO> getAllTags() {
        return tagRepository.findAll().stream()
                .map(tag -> {
                    TagDTO dto = new TagDTO();
                    dto.setId(tag.getId());
                    dto.setName(tag.getName());
                    dto.setSlug(tag.getSlug());
                    dto.setPostCount(tag.getBlogPosts().size());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}