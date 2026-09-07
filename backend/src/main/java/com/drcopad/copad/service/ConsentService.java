package com.drcopad.copad.service;

import com.drcopad.copad.entity.Consent;
import com.drcopad.copad.entity.ConsentType;
import com.drcopad.copad.repository.ConsentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * What each person has agreed to.
 *
 * Health data is a special category and consent for it must be explicit. The
 * product previously took none, while telling people in the privacy policy that
 * they could withdraw it - a promise about something that had never happened.
 *
 * Recording consent is the easy half. The half that matters is that a refusal
 * has to change behaviour: a person who declines to have their content sent
 * abroad must actually stop having it sent. That check belongs at the point of
 * sending, and this service exists so that check has something to ask.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ConsentService {

    /**
     * The version of the consent text in force.
     *
     * Bump this when the wording changes materially. Existing grants keep the
     * version they were given against, because consent is to a specific text
     * and a rewritten one cannot show what somebody agreed to.
     */
    @Value("${consent.policy-version:2026-09-07}")
    private String policyVersion;

    private final ConsentRepository consents;

    @Transactional
    public Consent grant(Long userId, ConsentType type, Long familyMemberId) {
        // Already held, so re-granting is a no-op rather than a second row.
        var existing = familyMemberId == null
                ? consents.findFirstByUserIdAndConsentTypeAndWithdrawnAtIsNull(userId, type)
                : consents.findFirstByUserIdAndConsentTypeAndFamilyMemberIdAndWithdrawnAtIsNull(
                        userId, type, familyMemberId);
        if (existing.isPresent()) return existing.get();

        Consent consent = new Consent();
        consent.setUserId(userId);
        consent.setConsentType(type);
        consent.setFamilyMemberId(familyMemberId);
        consent.setPolicyVersion(policyVersion);
        Consent saved = consents.save(consent);

        log.info("Consent {} granted by user {}", type, userId);
        return saved;
    }

    /**
     * Withdraws a consent.
     *
     * The row stays and is timestamped. That someone agreed and later changed
     * their mind is part of the record, and removing it would leave no way to
     * show what processing was lawful at the time it happened.
     */
    @Transactional
    public boolean withdraw(Long userId, ConsentType type) {
        return withdraw(userId, type, null);
    }

    @Transactional
    public boolean withdraw(Long userId, ConsentType type, Long familyMemberId) {
        if (type == ConsentType.GUARDIAN && familyMemberId == null) {
            throw new IllegalArgumentException("A family member is required for a guardian declaration");
        }
        var existing = type == ConsentType.GUARDIAN
                ? consents.findFirstByUserIdAndConsentTypeAndFamilyMemberIdAndWithdrawnAtIsNull(userId, type, familyMemberId)
                : consents.findFirstByUserIdAndConsentTypeAndWithdrawnAtIsNull(userId, type);
        if (existing.isEmpty()) {
            // DELETE also records an initial refusal. A grant followed by a
            // withdrawal would falsely claim the person once agreed.
            if (type == ConsentType.GUARDIAN || hasRefused(userId, type)) return false;
            Consent refusal = new Consent();
            refusal.setUserId(userId);
            refusal.setConsentType(type);
            refusal.setPolicyVersion(policyVersion);
            refusal.setWithdrawnAt(LocalDateTime.now());
            consents.save(refusal);
            return true;
        }

        Consent consent = existing.get();
        consent.setWithdrawnAt(LocalDateTime.now());
        consents.save(consent);
        log.info("Consent {} withdrawn by user {}", type, userId);
        return true;
    }

    @Transactional(readOnly = true)
    public boolean has(Long userId, ConsentType type) {
        if (userId == null) return false;
        return consents.findFirstByUserIdAndConsentTypeAndWithdrawnAtIsNull(userId, type)
                .isPresent();
    }

    /**
     * Whether this person has actively refused, as opposed to never having been
     * asked.
     *
     * The distinction decides whether the product keeps working. Nobody has been
     * asked yet, so treating absence as refusal would switch the assistant off
     * for every existing user at the moment consent shipped. A withdrawal, on
     * the other hand, is a decision someone made and has to be honoured.
     */
    @Transactional(readOnly = true)
    public boolean hasRefused(Long userId, ConsentType type) {
        if (userId == null) return false;
        return consents.findFirstByUserIdAndConsentTypeAndWithdrawnAtIsNotNull(userId, type)
                .isPresent()
                && consents.findFirstByUserIdAndConsentTypeAndWithdrawnAtIsNull(userId, type)
                .isEmpty();
    }

    /** Whether this account has claimed responsibility for that member. */
    @Transactional(readOnly = true)
    public boolean hasGuardianClaim(Long userId, Long familyMemberId) {
        if (userId == null || familyMemberId == null) return false;
        return consents.findFirstByUserIdAndConsentTypeAndFamilyMemberIdAndWithdrawnAtIsNull(
                userId, ConsentType.GUARDIAN, familyMemberId).isPresent();
    }

    /** What this person has agreed to, for them to see. */
    @Transactional(readOnly = true)
    public Map<String, Object> summary(Long userId) {
        List<Consent> all = consents.findByUserIdOrderByGrantedAtDesc(userId);

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("policyVersion", policyVersion);
        out.put("consents", all.stream().map(c -> {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("type", c.getConsentType());
            row.put("familyMemberId", c.getFamilyMemberId());
            row.put("policyVersion", c.getPolicyVersion());
            row.put("grantedAt", c.getGrantedAt());
            row.put("withdrawnAt", c.getWithdrawnAt());
            row.put("active", c.isActive());
            return row;
        }).toList());
        return out;
    }
}
