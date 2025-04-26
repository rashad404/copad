package com.drcopad.copad.controller;

import com.drcopad.copad.dto.*;
import com.drcopad.copad.entity.User;
import com.drcopad.copad.service.BlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/blog")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminBlogController {

    private final BlogService blogService;

    // Post Management
    @GetMapping("/posts")
    public ResponseEntity<Page<BlogPostListDTO>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort.Direction dir = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(dir, sortBy));
        return ResponseEntity.ok(blogService.getAllPosts(pageRequest));
    }

    @GetMapping("/posts/{id}")
    public ResponseEntity<BlogPostDTO> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(blogService.getPostById(id));
    }

    @PostMapping("/posts")
    public ResponseEntity<BlogPostDTO> createPost(
            @Valid @RequestBody BlogPostCreateDTO createDTO,
            @AuthenticationPrincipal User user
    ) {
        return new ResponseEntity<>(blogService.createPost(createDTO, user.getId()), HttpStatus.CREATED);
    }

    @PutMapping("/posts/{id}")
    public ResponseEntity<BlogPostDTO> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody BlogPostUpdateDTO updateDTO,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(blogService.updatePost(id, updateDTO, user.getId()));
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Void> deletePost(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        blogService.deletePost(id, user.getId());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/posts/{id}/publish")
    public ResponseEntity<BlogPostDTO> publishPost(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        BlogPostUpdateDTO updateDTO = new BlogPostUpdateDTO();
        updateDTO.setPublished(true);
        return ResponseEntity.ok(blogService.updatePost(id, updateDTO, user.getId()));
    }

    @PutMapping("/posts/{id}/unpublish")
    public ResponseEntity<BlogPostDTO> unpublishPost(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        BlogPostUpdateDTO updateDTO = new BlogPostUpdateDTO();
        updateDTO.setPublished(false);
        return ResponseEntity.ok(blogService.updatePost(id, updateDTO, user.getId()));
    }

    @PostMapping("/posts/bulk-delete")
    public ResponseEntity<Void> bulkDeletePosts(
            @RequestBody Map<String, List<Long>> requestBody,
            @AuthenticationPrincipal User user
    ) {
        List<Long> ids = requestBody.get("ids");
        if (ids != null && !ids.isEmpty()) {
            ids.forEach(id -> blogService.deletePost(id, user.getId()));
        }
        return ResponseEntity.noContent().build();
    }

    // Tag Management
    @GetMapping("/tags")
    public ResponseEntity<List<TagDTO>> getAllTags() {
        return ResponseEntity.ok(blogService.getAllTags());
    }

    @GetMapping("/tags/{id}")
    public ResponseEntity<TagDTO> getTagById(@PathVariable Long id) {
        return ResponseEntity.ok(blogService.getTagById(id));
    }

    @PostMapping("/tags")
    public ResponseEntity<TagDTO> createTag(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        if (name == null || name.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return new ResponseEntity<>(blogService.createTag(name), HttpStatus.CREATED);
    }

    @PutMapping("/tags/{id}")
    public ResponseEntity<TagDTO> updateTag(
            @PathVariable Long id,
            @RequestBody Map<String, String> request
    ) {
        String name = request.get("name");
        if (name == null || name.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(blogService.updateTag(id, name));
    }

    @DeleteMapping("/tags/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable Long id) {
        blogService.deleteTag(id);
        return ResponseEntity.noContent().build();
    }

    // Dashboard Statistics
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(blogService.getDashboardStats());
    }

    @GetMapping("/dashboard/recent-posts")
    public ResponseEntity<List<BlogPostListDTO>> getRecentPosts(
            @RequestParam(defaultValue = "5") int limit
    ) {
        return ResponseEntity.ok(blogService.getRecentPosts(limit));
    }
}