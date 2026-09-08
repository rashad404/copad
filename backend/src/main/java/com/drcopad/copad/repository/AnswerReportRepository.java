package com.drcopad.copad.repository;

import com.drcopad.copad.entity.AnswerReport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnswerReportRepository extends JpaRepository<AnswerReport, Long> {

    Page<AnswerReport> findByStatusOrderByCreatedAtDesc(AnswerReport.Status status,
                                                        Pageable pageable);

    /** One report per person per message. Reporting twice is not two problems. */
    boolean existsByChatMessageIdAndGuestSessionId(Long chatMessageId, String guestSessionId);
}
