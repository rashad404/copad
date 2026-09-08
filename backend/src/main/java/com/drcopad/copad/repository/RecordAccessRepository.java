package com.drcopad.copad.repository;

import com.drcopad.copad.entity.RecordAccess;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecordAccessRepository extends JpaRepository<RecordAccess, Long> {

    /** What the person who shared can see: who opened their record, newest first. */
    List<RecordAccess> findByFamilyMemberIdOrderByAccessedAtDesc(Long familyMemberId);
}
