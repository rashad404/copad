package com.drcopad.copad.repository;

import com.drcopad.copad.entity.Tag;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    
    Optional<Tag> findByName(String name);
    
    Optional<Tag> findBySlug(String slug);
    
    boolean existsByName(String name);
    
    @Query("SELECT t FROM Tag t JOIN t.blogPosts b GROUP BY t ORDER BY COUNT(b) DESC")
    List<Tag> findTopTags(Pageable pageable);
}