package com.drcopad.copad.service;

import com.drcopad.copad.entity.*;
import com.drcopad.copad.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Deletion has to be real, and has to stop at what belongs to the person asking.
 *
 * Both halves are easy to get wrong quietly: a soft delete that looks like a
 * deletion, or a deletion that reaches into a family somebody else also holds.
 */
class RecordDeletionServiceTest {

    private FamilyService familyService;
    private FamilyMemberRepository members;
    private FamilyMembershipRepository memberships;
    private FamilyRepository families;
    private UserRepository users;
    private DocumentRepository documents;
    private DocumentStorageService storage;
    private DeletionRecordRepository deletions;
    private PasswordEncoder passwordEncoder;
    private RecordDeletionService service;

    @BeforeEach
    void setUp() {
        familyService = mock(FamilyService.class);
        members = mock(FamilyMemberRepository.class);
        memberships = mock(FamilyMembershipRepository.class);
        families = mock(FamilyRepository.class);
        users = mock(UserRepository.class);
        documents = mock(DocumentRepository.class);
        storage = mock(DocumentStorageService.class);
        deletions = mock(DeletionRecordRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);

        service = new RecordDeletionService(
                familyService, members, memberships, families, users,
                mock(MedicalConditionRepository.class), mock(AllergyRepository.class),
                mock(MedicationRepository.class), mock(ImmunizationRepository.class),
                mock(VitalReadingRepository.class), mock(RecordRevisionRepository.class),
                mock(LabResultRepository.class), documents,
                storage, deletions, passwordEncoder);
    }

    private User user(long id, String hash) {
        User u = new User();
        u.setId(id);
        u.setPassword(hash);
        return u;
    }

    @Test
    void deletingAMemberRemovesTheStoredFilesToo() {
        FamilyMember member = new FamilyMember();
        member.setId(5L);
        when(familyService.requireMemberAccess(5L, 1L, true)).thenReturn(member);

        Document doc = new Document();
        doc.setStorageKey("5/2026/09/abc");
        when(documents.findByFamilyMemberId(5L)).thenReturn(List.of(doc));

        service.deleteMember(5L, 1L);

        // A row removed without its file leaves patient data on disk that
        // nothing points at and nothing will ever clean up.
        verify(storage).delete("5/2026/09/abc");
        verify(members).delete(member);
        verify(deletions).save(any(DeletionRecord.class));
    }

    @Test
    void aWrongPasswordDeletesNothing() {
        when(users.findById(1L)).thenReturn(Optional.of(user(1L, "hashed")));
        when(passwordEncoder.matches(eq("wrong"), any())).thenReturn(false);

        assertThrows(AccessDeniedException.class, () -> service.deleteAccount(1L, "wrong"));
        verify(users, never()).delete(any());
        verify(memberships, never()).delete(any());
    }

    @Test
    void noPasswordDeletesNothing() {
        when(users.findById(1L)).thenReturn(Optional.of(user(1L, "hashed")));
        assertThrows(AccessDeniedException.class, () -> service.deleteAccount(1L, null));
        verify(users, never()).delete(any());
    }

    @Test
    void anAccountLeavesAFamilySomebodyElseHoldsRatherThanErasingIt() {
        // The decisive case. Records another person also holds are not the
        // leaver's to destroy.
        User leaving = user(1L, "hashed");
        when(users.findById(1L)).thenReturn(Optional.of(leaving));
        when(passwordEncoder.matches(any(), any())).thenReturn(true);

        Family family = new Family();
        family.setId(9L);

        FamilyMembership mine = new FamilyMembership();
        mine.setFamily(family);
        mine.setUser(leaving);

        FamilyMembership theirs = new FamilyMembership();
        theirs.setFamily(family);
        theirs.setUser(user(2L, "other"));

        when(memberships.findByUserId(1L)).thenReturn(List.of(mine));
        when(memberships.findByFamilyId(9L)).thenReturn(List.of(mine, theirs));

        service.deleteAccount(1L, "right");

        verify(memberships).delete(mine);
        verify(families, never()).delete(any());
        verify(members, never()).delete(any());
        verify(users).delete(leaving);
    }

    @Test
    void anAccountThatHoldsAFamilyAloneRemovesIt() {
        User leaving = user(1L, "hashed");
        when(users.findById(1L)).thenReturn(Optional.of(leaving));
        when(passwordEncoder.matches(any(), any())).thenReturn(true);

        Family family = new Family();
        family.setId(9L);
        FamilyMembership only = new FamilyMembership();
        only.setFamily(family);
        only.setUser(leaving);

        FamilyMember member = new FamilyMember();
        member.setId(5L);

        when(memberships.findByUserId(1L)).thenReturn(List.of(only));
        when(memberships.findByFamilyId(9L)).thenReturn(List.of(only));
        when(members.findByFamilyId(9L)).thenReturn(List.of(member));
        when(documents.findByFamilyMemberId(5L)).thenReturn(List.of());

        service.deleteAccount(1L, "right");

        verify(members).delete(member);
        verify(families).delete(family);
        verify(users).delete(leaving);
    }

    @Test
    void whatIsKeptCarriesNoContent() {
        FamilyMember member = new FamilyMember();
        member.setId(5L);
        member.setFullName("Aygun Memmedova");
        when(familyService.requireMemberAccess(5L, 1L, true)).thenReturn(member);
        when(documents.findByFamilyMemberId(5L)).thenReturn(List.of());

        service.deleteMember(5L, 1L);

        var captor = org.mockito.ArgumentCaptor.forClass(DeletionRecord.class);
        verify(deletions).save(captor.capture());
        DeletionRecord kept = captor.getValue();

        assertEquals(5L, kept.getSubjectRef());
        // Counts only. A name surviving a deletion would defeat the point.
        assertFalse(kept.getRemovedCounts().contains("Aygun"));
        assertTrue(kept.getRemovedCounts().contains("allergies"));
    }
}
