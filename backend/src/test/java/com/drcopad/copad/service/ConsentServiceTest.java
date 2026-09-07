package com.drcopad.copad.service;

import com.drcopad.copad.entity.Consent;
import com.drcopad.copad.entity.ConsentType;
import com.drcopad.copad.repository.ConsentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Consent, and the distinction the product depends on.
 *
 * Never having been asked is not refusal. Confusing the two would switch the
 * assistant off for every existing user the moment consent shipped, which is why
 * it is pinned here rather than left to a reading of the code.
 */
class ConsentServiceTest {

    private ConsentRepository repository;
    private ConsentService service;

    @BeforeEach
    void setUp() {
        repository = mock(ConsentRepository.class);
        service = new ConsentService(repository);
        ReflectionTestUtils.setField(service, "policyVersion", "2026-09-07");
    }

    private Consent granted() {
        Consent c = new Consent();
        c.setConsentType(ConsentType.CROSS_BORDER_AI);
        c.setGrantedAt(LocalDateTime.now());
        return c;
    }

    private Consent withdrawn() {
        Consent c = granted();
        c.setWithdrawnAt(LocalDateTime.now());
        return c;
    }

    @Test
    void neverAskedIsNotRefusal() {
        when(repository.findFirstByUserIdAndConsentTypeAndWithdrawnAtIsNotNull(any(), any()))
                .thenReturn(Optional.empty());
        assertFalse(service.hasRefused(1L, ConsentType.CROSS_BORDER_AI));
    }

    @Test
    void anExplicitWithdrawalIsRefusal() {
        when(repository.findFirstByUserIdAndConsentTypeAndWithdrawnAtIsNotNull(any(), any()))
                .thenReturn(Optional.of(withdrawn()));
        when(repository.findFirstByUserIdAndConsentTypeAndWithdrawnAtIsNull(any(), any()))
                .thenReturn(Optional.empty());
        assertTrue(service.hasRefused(1L, ConsentType.CROSS_BORDER_AI));
    }

    @Test
    void grantingAgainAfterWithdrawalUndoesTheRefusal() {
        // Someone who changes their mind back must get the product back.
        when(repository.findFirstByUserIdAndConsentTypeAndWithdrawnAtIsNotNull(any(), any()))
                .thenReturn(Optional.of(withdrawn()));
        when(repository.findFirstByUserIdAndConsentTypeAndWithdrawnAtIsNull(any(), any()))
                .thenReturn(Optional.of(granted()));
        assertFalse(service.hasRefused(1L, ConsentType.CROSS_BORDER_AI));
    }

    @Test
    void withdrawalKeepsTheRow() {
        // That someone agreed and later changed their mind is part of the
        // record; deleting it would leave no way to show what processing was
        // lawful at the time.
        Consent existing = granted();
        when(repository.findFirstByUserIdAndConsentTypeAndWithdrawnAtIsNull(any(), any()))
                .thenReturn(Optional.of(existing));

        assertTrue(service.withdraw(1L, ConsentType.CROSS_BORDER_AI));
        assertNotNull(existing.getWithdrawnAt());
        verify(repository).save(existing);
        verify(repository, never()).delete(any());
    }

    @Test
    void initialRefusalNeverInventsAGrant() {
        service.withdraw(1L, ConsentType.CROSS_BORDER_AI);
        var captor = org.mockito.ArgumentCaptor.forClass(Consent.class);
        verify(repository).save(captor.capture());
        ReflectionTestUtils.invokeMethod(captor.getValue(), "onCreate");
        assertNull(captor.getValue().getGrantedAt());
        assertNotNull(captor.getValue().getWithdrawnAt());
        assertEquals(ConsentType.CROSS_BORDER_AI, captor.getValue().getConsentType());
    }

    @Test
    void guardianWithdrawalTargetsOnlyTheNamedMember() {
        Consent guardian = granted();
        guardian.setConsentType(ConsentType.GUARDIAN);
        guardian.setFamilyMemberId(9L);
        when(repository.findFirstByUserIdAndConsentTypeAndFamilyMemberIdAndWithdrawnAtIsNull(
                1L, ConsentType.GUARDIAN, 9L)).thenReturn(Optional.of(guardian));
        service.withdraw(1L, ConsentType.GUARDIAN, 9L);
        verify(repository).save(guardian);
        verify(repository, never()).findFirstByUserIdAndConsentTypeAndWithdrawnAtIsNull(any(), any());
        assertNotNull(guardian.getWithdrawnAt());
    }

    @Test
    void unscopedGuardianWithdrawalCannotAffectAnArbitraryMember() {
        assertThrows(IllegalArgumentException.class, () -> service.withdraw(1L, ConsentType.GUARDIAN));
        verifyNoInteractions(repository);
    }

    @Test
    void repeatedRefusalIsIdempotent() {
        when(repository.findFirstByUserIdAndConsentTypeAndWithdrawnAtIsNotNull(any(), any()))
                .thenReturn(Optional.of(withdrawn()));
        assertFalse(service.withdraw(1L, ConsentType.CROSS_BORDER_AI));
        verify(repository, never()).save(any());
    }

    @Test
    void grantingTwiceDoesNotCreateASecondRow() {
        when(repository.findFirstByUserIdAndConsentTypeAndWithdrawnAtIsNull(any(), any()))
                .thenReturn(Optional.of(granted()));
        service.grant(1L, ConsentType.CROSS_BORDER_AI, null);
        verify(repository, never()).save(any());
    }

    @Test
    void aGrantRecordsTheTextItWasGivenAgainst() {
        // Consent is to a specific wording; a rewritten one cannot show what
        // was agreed.
        when(repository.findFirstByUserIdAndConsentTypeAndWithdrawnAtIsNull(any(), any()))
                .thenReturn(Optional.empty());
        when(repository.save(any())).thenAnswer(i -> i.getArgument(0));

        Consent saved = service.grant(1L, ConsentType.RECORD_STORAGE, null);
        assertEquals("2026-09-07", saved.getPolicyVersion());
    }

    @Test
    void separatePurposesAreSeparateDecisions() {
        when(repository.findByUserIdOrderByGrantedAtDesc(1L)).thenReturn(List.of(granted()));
        var summary = service.summary(1L);
        assertEquals("2026-09-07", summary.get("policyVersion"));
        assertFalse(((List<?>) summary.get("consents")).isEmpty());
    }
}
