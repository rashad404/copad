package com.drcopad.copad.service;

import com.drcopad.copad.entity.*;
import com.drcopad.copad.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDate;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ImmunizationUpdateTest {
    @Mock MedicalConditionRepository conditionRepository;
    @Mock AllergyRepository allergyRepository;
    @Mock MedicationRepository medicationRepository;
    @Mock ImmunizationRepository immunizationRepository;
    @Mock RecordRevisionRepository revisionRepository;
    @Mock FamilyService familyService;
    @Mock UserRepository userRepository;
    @Mock ObjectMapper objectMapper;
    @InjectMocks ClinicalRecordService service;

    @Test void updatesTheSameRecordAndAppendsAnAuditRevision() {
        FamilyMember member = FamilyMember.builder().id(10L).build();
        Immunization existing = new Immunization();
        existing.setId(20L); existing.setFamilyMember(member); existing.setVaccine("Original");
        Immunization changes = new Immunization();
        changes.setVaccine("Updated"); changes.setDoseNumber(2);
        changes.setAdministeredOn(LocalDate.of(2026, 1, 2));
        changes.setNextDueOn(LocalDate.of(2027, 1, 2));
        changes.setProvider("Clinic"); changes.setLotNumber("AB"); changes.setNotes("Updated note");
        when(familyService.requireMemberAccess(10L, 1L, true)).thenReturn(member);
        when(immunizationRepository.findByIdAndDeletedAtIsNull(20L)).thenReturn(Optional.of(existing));
        when(immunizationRepository.save(existing)).thenReturn(existing);
        Immunization result = service.updateImmunization(10L, 20L, 1L, changes);
        assertEquals(20L, result.getId()); assertSame(member, result.getFamilyMember());
        assertEquals("Updated", result.getVaccine()); assertEquals(2, result.getDoseNumber());
        assertEquals(changes.getAdministeredOn(), result.getAdministeredOn());
        assertEquals(changes.getNextDueOn(), result.getNextDueOn());
        assertEquals("Clinic", result.getProvider()); assertEquals("AB", result.getLotNumber());
        assertEquals("Updated note", result.getNotes());
        ArgumentCaptor<RecordRevision> revision = ArgumentCaptor.forClass(RecordRevision.class);
        verify(revisionRepository).save(revision.capture());
        assertEquals(RecordAction.UPDATED, revision.getValue().getAction());
        assertEquals(20L, revision.getValue().getRecordId());
        assertSame(member, revision.getValue().getFamilyMember());
    }

    @Test void rejectsReadOnlyAccessBeforeLoadingOrChangingARecord() {
        when(familyService.requireMemberAccess(10L, 1L, true)).thenThrow(new SecurityException("Read only"));
        assertThrows(SecurityException.class, () -> service.updateImmunization(10L, 20L, 1L, new Immunization()));
        verifyNoInteractions(immunizationRepository, revisionRepository);
    }

    @Test void rejectsAnEntryBelongingToAnotherMember() {
        FamilyMember member = FamilyMember.builder().id(10L).build();
        Immunization foreign = new Immunization(); foreign.setFamilyMember(FamilyMember.builder().id(11L).build());
        when(familyService.requireMemberAccess(10L, 1L, true)).thenReturn(member);
        when(immunizationRepository.findByIdAndDeletedAtIsNull(20L)).thenReturn(Optional.of(foreign));
        assertThrows(IllegalArgumentException.class, () -> service.updateImmunization(10L, 20L, 1L, new Immunization()));
        verify(immunizationRepository, never()).save(any()); verifyNoInteractions(revisionRepository);
    }
}
