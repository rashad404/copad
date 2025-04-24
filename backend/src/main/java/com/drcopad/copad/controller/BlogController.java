package com.drcopad.copad.controller;

import com.drcopad.copad.dto.*;
import com.drcopad.copad.entity.User;
import com.drcopad.copad.service.BlogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/blog")
@RequiredArgsConstructor
public class BlogController {

    private final BlogService blogService;
    
    @GetMapping
    public ResponseEntity<Page<BlogPostListDTO>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "publishedAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort.Direction dir = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(dir, sortBy));
        return ResponseEntity.ok(blogService.getAllPublishedPosts(pageRequest));
    }
    
    @GetMapping("/{slug}")
    public ResponseEntity<BlogPostDTO> getPostBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(blogService.getPostBySlug(slug));
    }
    
    @GetMapping("/tag/{tagSlug}")
    public ResponseEntity<Page<BlogPostListDTO>> getPostsByTag(
            @PathVariable String tagSlug,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "publishedAt"));
        return ResponseEntity.ok(blogService.getPostsByTag(tagSlug, pageRequest));
    }
    
    @GetMapping("/search")
    public ResponseEntity<Page<BlogPostListDTO>> searchPosts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "publishedAt"));
        return ResponseEntity.ok(blogService.searchPosts(keyword, pageRequest));
    }
    
    @PostMapping
    public ResponseEntity<BlogPostDTO> createPost(
            @Valid @RequestBody BlogPostCreateDTO createDTO,
            @AuthenticationPrincipal User user
    ) {
        return new ResponseEntity<>(blogService.createPost(createDTO, user.getId()), HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<BlogPostDTO> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody BlogPostUpdateDTO updateDTO,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(blogService.updatePost(id, updateDTO, user.getId()));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        blogService.deletePost(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}