package com.drcopad.copad.config;

import java.time.LocalDateTime;
import java.util.Set;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.drcopad.copad.entity.BlogPost;
import com.drcopad.copad.entity.MedicalSpecialty;
import com.drcopad.copad.entity.Tag;
import com.drcopad.copad.entity.User;
import com.drcopad.copad.repository.BlogPostRepository;
import com.drcopad.copad.repository.MedicalSpecialtyRepository;
import com.drcopad.copad.repository.TagRepository;
import com.drcopad.copad.repository.UserRepository;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final BlogPostRepository blogPostRepository;
    private final TagRepository tagRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MedicalSpecialtyRepository medicalSpecialtyRepository;

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

            // Create and save sample tags
            Tag technology = tagRepository.save(new Tag("Technology", "technology"));
            Tag health = tagRepository.save(new Tag("Health", "health"));
            Tag ai = tagRepository.save(new Tag("Artificial Intelligence", "artificial-intelligence"));

            // Create sample blog posts
            createBlogPost("Getting Started with Spring Boot", "getting-started-with-spring-boot", "A comprehensive guide to building your first Spring Boot application", "Spring Boot is a powerful framework for building Java applications...", admin, Set.of(technology), "https://example.com/spring-boot.jpg", "en");

            createBlogPost("The Future of Healthcare with AI", "future-of-healthcare-with-ai", "How artificial intelligence is transforming the healthcare industry", "Artificial Intelligence is revolutionizing healthcare in numerous ways...", admin, Set.of(health, ai), "https://example.com/ai-healthcare.jpg", "az");

            createBlogPost("Best Practices for Web Development", "best-practices-for-web-development", "Essential tips and tricks for modern web development", "Web development has evolved significantly over the years...", admin, Set.of(technology), "https://example.com/web-dev.jpg", "tr");

            // Create medical specialties
            initMedicalSpecialties();
        }
    }

    private void createBlogPost(String title, String slug, String summary, String content, User author, Set<Tag> tags, String featuredImage, String language) {
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
        post.setLanguage(language);
        blogPostRepository.save(post);
    }

    private void initMedicalSpecialties() {
        medicalSpecialtyRepository.save(new MedicalSpecialty("general", "A general practitioner who can address a wide range of medical conditions", "/icons/gp.png", true, "General Practitioner", "You are an experienced General Practitioner with 15 years of experience. You provide comprehensive primary care and can address a wide range of medical conditions. You are knowledgeable, empathetic, and always prioritize patient safety. You should provide general medical advice but always recommend consulting a doctor in person for serious conditions."));

        medicalSpecialtyRepository.save(new MedicalSpecialty("pediatric", "Specialist in children's health and development", "/icons/pediatrician.png", true, "Pediatrician", "You are a board-certified pediatrician specializing in children's health from birth to adolescence. You have extensive experience in child development, common childhood illnesses, and preventive care. You communicate in a child-friendly manner and provide guidance to parents about their children's health."));

        medicalSpecialtyRepository.save(new MedicalSpecialty("derma", "Specialist in skin, hair, and nail conditions", "/icons/dermatologist.png", true, "Dermatologist", "You are a dermatologist with expertise in skin conditions, hair, and nails. You can provide information about common skin conditions, treatments, and preventive care. You emphasize the importance of proper skincare and sun protection."));

        medicalSpecialtyRepository.save(new MedicalSpecialty("ent", "Specialist in ear, nose, and throat conditions", "/icons/ent.png", true, "ENT Specialist", "You are an otolaryngologist (ENT specialist) with expertise in ear, nose, and throat conditions. You can provide information about common ENT issues, hearing problems, sinus conditions, and throat disorders. You emphasize the importance of proper diagnosis and treatment for ENT conditions."));

        medicalSpecialtyRepository.save(new MedicalSpecialty("cardio", "Specialist in heart conditions", "/icons/cardiologist.png", true, "Cardiologist", "You are a cardiologist with expertise in heart conditions, blood vessels, and heart diseases. You can provide information about common heart conditions, treatments, and preventive care. You emphasize the importance of proper diagnosis and treatment for heart conditions."));

        medicalSpecialtyRepository.save(new MedicalSpecialty("psych", "Specialist in mental health conditions", "/icons/mentalhealth.png", true, "Mental Health Specialist", "You are a mental health specialist with expertise in mental health conditions, treatments, and preventive care. You can provide information about common mental health conditions, treatments, and preventive care. You emphasize the importance of proper diagnosis and treatment for mental health conditions."));

        medicalSpecialtyRepository.save(new MedicalSpecialty("generalhealth", "General practitioner who can address a wide range of medical conditions", "/icons/other.png", true, "general", "You are a general practitioner who can address a wide range of medical conditions. You provide comprehensive primary care and can address a wide range of medical conditions. You are knowledgeable, empathetic, and always prioritize patient safety. You should provide general medical advice but always recommend consulting a doctor in person for serious conditions."));
    }
}
