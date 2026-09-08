package com.drcopad.copad.entity;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.stream.Collectors;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;

    /**
     * The language this person reads in, so a message reaches them in it.
     *
     * Recorded from the interface they were using rather than asked for. Null
     * means we have not seen them choose, and Azerbaijani is the assumption.
     */
    @Column(name = "preferred_language", length = 8)
    private String preferredLanguage;

    /** Whether we may write to them about their appointments. */
    @Column(name = "notifications_enabled", nullable = false)
    private boolean notificationsEnabled = true;

    /**
     * A number to text, as they typed it. Optional, and nothing asks for it in
     * order to let somebody use the product.
     */
    @Column(length = 32)
    private String phone;

    /** Having a number and wanting to be texted are two different things. */
    @Column(name = "sms_enabled", nullable = false)
    private boolean smsEnabled = false;

    private String password;
    private int age;
    private String gender;

    @OneToOne(cascade = CascadeType.ALL)
    @JsonManagedReference
    private MedicalProfile medicalProfile;

    @OneToMany(mappedBy = "author") // (You had small typo `h` in `author`, be careful!)
    private Set<BlogPost> blogPosts;

    // Add to User.java
    @ElementCollection(fetch = FetchType.EAGER)
    private Set<String> roles = new HashSet<>();

    public String getFullName() {
        return this.name;
    }

    // --- Safe equals and hashCode ---
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;
        User user = (User) o;
        return id != null && id.equals(user.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
    // --------------------------------

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.roles.stream()
            .map(role -> {
                // If role already has ROLE_ prefix, don't add it again
                if (role.startsWith("ROLE_")) {
                    return new SimpleGrantedAuthority(role);
                } else {
                    return new SimpleGrantedAuthority("ROLE_" + role);
                }
            })
            .collect(Collectors.toList());
    }
    
    
    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    // Add getters and setters for roles field
    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }
}