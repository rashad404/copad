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
            @RequestParam(defaultValue = "22") int limit
    ) {
        return ResponseEntity.ok(tagService.getTopTags(limit));
    }
    
    @GetMapping("/{slug}")
    public ResponseEntity<TagDTO> getTagBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(tagService.getTagBySlug(slug));
    }
    
    // Tag creation lives at POST /api/admin/blog/tags.
    //
    // It used to be here, where /api/tags/** is public and nothing checked the
    // caller, so any visitor could write a tag onto the blog - which is how
    // "test" and "sdfdsf" came to be in production. Same shape as the
    // specialties hole: a write endpoint outside /api/admin is reachable by
    // anyone, because that prefix is the only thing the security config gates.
}