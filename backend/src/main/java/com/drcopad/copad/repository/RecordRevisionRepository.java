package com.drcopad.copad.repository;

import com.drcopad.copad.entity.RecordRevision;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecordRevisionRepository extends JpaRepository<RecordRevision, Long> {

    List<RecordRevision> findByFamilyMemberIdOrderByCreatedAtDesc(Long familyMemberId);

    List<RecordRevision> findByRecordTypeAndRecordIdOrderByCreatedAtDesc(String recordType, Long recordId);

    /** Real deletion, for a person who asked to be removed. */
    long deleteByFamilyMemberId(Long familyMemberId);
}
