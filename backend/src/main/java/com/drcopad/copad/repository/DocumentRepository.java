package com.drcopad.copad.repository;

import com.drcopad.copad.entity.Document;
import com.drcopad.copad.entity.ExtractionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByFamilyMemberIdAndDeletedAtIsNullOrderByDocumentDateDescIdDesc(Long memberId);

    Optional<Document> findByIdAndDeletedAtIsNull(Long id);

    List<Document> findByExtractionStatusAndDeletedAtIsNull(ExtractionStatus status);

    /** Same file uploaded twice for the same person. */
    Optional<Document> findFirstByFamilyMemberIdAndChecksumSha256AndDeletedAtIsNull(
            Long memberId, String checksum);
}
