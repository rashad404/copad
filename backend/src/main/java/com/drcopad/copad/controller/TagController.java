package com.drcopad.copad.controller;

import com.drcopad.copad.dto.TagDTO;
import com.drcopad.copad.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;
    
    @GetMapping
    public ResponseEntity<List<TagDTO>> getAllTags() {
        return ResponseEntity.ok(tagService.getAllTags());
    }
    
    @GetMapping("/top")
    public ResponseEntity<List<TagDTO>> getTopTags(
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ResponseEntity.ok(tagService.getTopTags(limit));
    }
    
    @GetMapping("/{slug}")
    public ResponseEntity<TagDTO> getTagBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(tagService.getTagBySlug(slug));
    }
    
    @PostMapping
    public ResponseEntity<TagDTO> createTag(@RequestParam String name) {
        return ResponseEntity.ok(tagService.createTag(name));
    }
}