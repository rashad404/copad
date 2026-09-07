package com.drcopad.copad.repository;

import com.drcopad.copad.entity.Consent;
import com.drcopad.copad.entity.ConsentType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConsentRepository extends JpaRepository<Consent, Long> {

    List<Consent> findByUserIdOrderByGrantedAtDesc(Long userId);

    Optional<Consent> findFirstByUserIdAndConsentTypeAndWithdrawnAtIsNull(
            Long userId, ConsentType consentType);

    Optional<Consent> findFirstByUserIdAndConsentTypeAndFamilyMemberIdAndWithdrawnAtIsNull(
            Long userId, ConsentType consentType, Long familyMemberId);

    /** An explicit refusal, as opposed to never having been asked. */
    Optional<Consent> findFirstByUserIdAndConsentTypeAndWithdrawnAtIsNotNull(
            Long userId, ConsentType consentType);
}
