package com.drcopad.copad.repository;

import com.drcopad.copad.entity.Family;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface FamilyRepository extends JpaRepository<Family, Long> {

    Optional<Family> findByIdAndDeletedAtIsNull(Long id);

    /** Families a user can see, by membership rather than ownership. */
    @Query("""
            SELECT fm.family FROM FamilyMembership fm
            WHERE fm.user.id = :userId AND fm.family.deletedAt IS NULL
            ORDER BY fm.family.createdAt
            """)
    List<Family> findAllForUser(Long userId);

    Optional<Family> findFirstByOwnerIdAndDeletedAtIsNullOrderByCreatedAtAsc(Long ownerId);
}
