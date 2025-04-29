package com.drcopad.copad.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.drcopad.copad.dto.TagDTO;
import com.drcopad.copad.entity.Tag;
import com.drcopad.copad.repository.TagRepository;

import lombok.RequiredArgsConstructor;

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
        TagDTO one = new TagDTO();
        one.setId(1L);
        one.setName("java");
        one.setSlug("java");
        one.setPostCount(2);
        TagDTO two = new TagDTO();
        two.setId(1L);
        two.setName("java");
        two.setSlug("java");
        two.setPostCount(2);
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
        
        // Replace Turkish characters with English equivalents
        String slugText = name;
        slugText = slugText.replace("ə", "e").replace("ü", "u").replace("ç", "c")
                    .replace("ş", "s").replace("ı", "i").replace("ö", "o").replace("ğ", "g")
                    .replace("Ə", "E").replace("Ü", "U").replace("Ç", "C")
                    .replace("Ş", "S").replace("I", "I").replace("Ö", "O").replace("Ğ", "G");
        
        // Generate slug
        String slug = slugText.toLowerCase()
                    .replaceAll("[^\\w\\s-]", "") // Remove special chars
                    .replaceAll("\\s+", "-")      // Replace spaces with hyphens
                    .replaceAll("-+", "-")        // Replace multiple hyphens with single hyphen
                    .trim();
        
        tag.setSlug(slug);
        
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