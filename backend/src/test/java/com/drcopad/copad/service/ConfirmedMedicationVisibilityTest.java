package com.drcopad.copad.service;

import com.drcopad.copad.entity.*;
import com.drcopad.copad.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDate;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ConfirmedMedicationVisibilityTest {
    @Mock MedicalConditionRepository conditionRepository;
    @Mock AllergyRepository allergyRepository;
    @Mock MedicationRepository medicationRepository;
    @Mock ImmunizationRepository immunizationRepository;
    @Mock RecordRevisionRepository revisionRepository;
    @Mock VitalReadingRepository vitalRepository;
    @Mock FamilyService familyService;
    @Mock UserRepository userRepository;
    @Mock ObjectMapper objectMapper;
    @InjectMocks ClinicalRecordService records;
    @InjectMocks TimelineService timeline;

    private Medication medication(long id, boolean confirmed) {
        Medication m = new Medication();
        m.setId(id); m.setName(confirmed ? "Confirmed medicine" : "Unreviewed dose");
        m.setConfirmed(confirmed); m.setStartedOn(LocalDate.of(2026, 1, 1));
        m.setEndedOn(LocalDate.of(2026, 2, 1));
        return m;
    }

    @Test void ordinaryRecordAndItsPdfExportSourceExcludeProposals() {
        Medication confirmed = medication(1, true), proposal = medication(2, false);
        when(medicationRepository.findByFamilyMemberIdAndDeletedAtIsNullOrderByIdDesc(10L))
                .thenReturn(List.of(proposal, confirmed));
        assertEquals(List.of(confirmed), records.medications(10L, 7L));
        verify(familyService).requireMemberAccess(10L, 7L, false);
    }

    @Test void timelineExcludesBothLifecycleEventsUntilConfirmation() {
        Medication confirmed = medication(1, true), proposal = medication(2, false);
        when(medicationRepository.findByFamilyMemberIdAndDeletedAtIsNullOrderByIdDesc(10L))
                .thenReturn(List.of(proposal, confirmed));
        var events = timeline.forMember(10L, 7L, 100);
        assertEquals(2, events.size());
        assertTrue(events.stream().allMatch(e -> e.recordId() == 1L));
        assertEquals(TimelineService.EntryType.MEDICATION_STOPPED, events.get(0).type());
        proposal.setConfirmed(true);
        assertEquals(4, timeline.forMember(10L, 7L, 100).size());
    }
}
