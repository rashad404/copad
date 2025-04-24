package com.drcopad.copad.config;

import com.drcopad.copad.entity.BlogPost;
import com.drcopad.copad.entity.Tag;
import com.drcopad.copad.entity.User;
import com.drcopad.copad.repository.BlogPostRepository;
import com.drcopad.copad.repository.TagRepository;
import com.drcopad.copad.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Set;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final BlogPostRepository blogPostRepository;
    private final TagRepository tagRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
        // Create admin user if not exists
        if (userRepository.findByEmail("admin@example.com").isEmpty()) {
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setAge(30);
            admin.setGender("Male");
            userRepository.save(admin);

            // Create and save sample tags first
            Tag technology = new Tag();
            technology.setName("Technology");
            technology.setSlug("technology");
            technology = tagRepository.save(technology);

            Tag health = new Tag();
            health.setName("Health");
            health.setSlug("health");
            health = tagRepository.save(health);

            Tag ai = new Tag();
            ai.setName("Artificial Intelligence");
            ai.setSlug("artificial-intelligence");
            ai = tagRepository.save(ai);

            // Create sample blog posts with the saved tags
            createBlogPost(
                "Getting Started with Spring Boot",
                "getting-started-with-spring-boot",
                "A comprehensive guide to building your first Spring Boot application",
                "Spring Boot is a powerful framework for building Java applications...",
                admin,
                Set.of(technology),
                "https://example.com/spring-boot.jpg"
            );

            createBlogPost(
                "The Future of Healthcare with AI",
                "future-of-healthcare-with-ai",
                "How artificial intelligence is transforming the healthcare industry",
                "Artificial Intelligence is revolutionizing healthcare in numerous ways...",
                admin,
                Set.of(health, ai),
                "https://example.com/ai-healthcare.jpg"
            );

            createBlogPost(
                "Best Practices for Web Development",
                "best-practices-for-web-development",
                "Essential tips and tricks for modern web development",
                "Web development has evolved significantly over the years...",
                admin,
                Set.of(technology),
                "https://example.com/web-dev.jpg"
            );
        }
    }

    private void createBlogPost(String title, String slug, String summary, String content, User author, Set<Tag> tags, String featuredImage) {
        BlogPost post = new BlogPost();
        post.setTitle(title);
        post.setSlug(slug);
        post.setSummary(summary);
        post.setContent(content);
        post.setAuthor(author);
        post.setTags(tags);
        post.setPublished(true);
        post.setPublishedAt(LocalDateTime.now());
        post.setFeaturedImage(featuredImage);
        blogPostRepository.save(post);
    }
} 