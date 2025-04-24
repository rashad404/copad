package com.drcopad.copad.repository;

import com.drcopad.copad.entity.BlogPost;
import com.drcopad.copad.entity.Tag;
import com.drcopad.copad.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    
    Page<BlogPost> findAllByPublishedTrue(Pageable pageable);
    
    Optional<BlogPost> findBySlug(String slug);
    
    List<BlogPost> findByAuthor(User author);
    
    @Query("SELECT b FROM BlogPost b JOIN b.tags t WHERE t = :tag AND b.published = true")
    Page<BlogPost> findByTagAndPublishedTrue(Tag tag, Pageable pageable);
    
    @Query("SELECT b FROM BlogPost b WHERE b.title LIKE %:keyword% OR b.content LIKE %:keyword% OR b.summary LIKE %:keyword% AND b.published = true")
    Page<BlogPost> searchByKeyword(String keyword, Pageable pageable);
}