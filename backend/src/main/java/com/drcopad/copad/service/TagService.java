package com.drcopad.copad.service;

import com.drcopad.copad.dto.TagDTO;
import com.drcopad.copad.entity.Tag;
import com.drcopad.copad.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;
    
    public List<TagDTO> getAllTags() {
        return tagRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<TagDTO> getTopTags(int limit) {
        return tagRepository.findTopTags(PageRequest.of(0, limit)).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public TagDTO getTagBySlug(String slug) {
        Tag tag = tagRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Tag not found"));
        return convertToDTO(tag);
    }
    
    public Tag getOrCreateTag(String name) {
        String slug = name.toLowerCase().replace(' ', '-');
        
        return tagRepository.findByName(name)
                .orElseGet(() -> {
                    Tag newTag = new Tag();
                    newTag.setName(name);
                    newTag.setSlug(slug);
                    return tagRepository.save(newTag);
                });
    }
    
    public TagDTO createTag(String name) {
        if (tagRepository.existsByName(name)) {
            throw new RuntimeException("Tag already exists");
        }
        
        Tag tag = new Tag();
        tag.setName(name);
        tag.setSlug(name.toLowerCase().replace(' ', '-'));
        
        Tag savedTag = tagRepository.save(tag);
        return convertToDTO(savedTag);
    }
    
    private TagDTO convertToDTO(Tag tag) {
        TagDTO dto = new TagDTO();
        dto.setId(tag.getId());
        dto.setName(tag.getName());
        dto.setSlug(tag.getSlug());
        dto.setPostCount(tag.getBlogPosts().size());
        return dto;
    }
}