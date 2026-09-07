package com.drcopad.copad.service;

import com.drcopad.copad.entity.*;
import com.drcopad.copad.repository.LabResultRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

/**
 * Unconfirmed data must never reach the model.
 *
 * A value read out of a document is a proposal until a person accepts it. If one
 * leaks into the context the assistant reasons over a number nobody checked and
 * presents the conclusion as fact, which is worse than having no value at all.
 *
 * The filter is one call in a long method and a regression would be silent, so
 * it is pinned here rather than left to the end-to-end check.
 */
class RecordContextConfirmationTest {

    private FamilyService familyService;
    private ClinicalRecordService records;
    private VitalService vitals;
    private LabResultRepository labResults;
    private RecordContextService context;

    private static final long MEMBER = 1L;
    private static final long USER = 2L;

    @BeforeEach
    void setUp() {
        familyService = mock(FamilyService.class);
        records = mock(ClinicalRecordService.class);
        vitals = mock(VitalService.class);
        labResults = mock(LabResultRepository.class);
        context = new RecordContextService(familyService, records, vitals, labResults);

        FamilyMember member = new FamilyMember();
        member.setFullName("Test Person");
        when(familyService.requireMemberAccess(anyLong(), anyLong(), anyBoolean()))
                .thenReturn(member);
        when(records.allergies(anyLong(), anyLong())).thenReturn(List.of());
        when(records.conditions(anyLong(), anyLong())).thenReturn(List.of());
        when(vitals.latestByType(anyLong(), anyLong())).thenReturn(java.util.Map.of());
        when(vitals.trends(anyLong(), anyLong(), anyInt())).thenReturn(List.of());
    }

    private LabResult lab(String analyte, String value, boolean confirmed) {
        LabResult r = new LabResult();
        r.setAnalyte(analyte);
        r.setAnalyteKey(analyte.toLowerCase());
        r.setValueNumeric(new BigDecimal(value));
        r.setUnit("mmol/L");
        r.setConfirmed(confirmed);
        r.setCollectedAt(LocalDateTime.now());
        return r;
    }

    private Medication medication(String name, boolean confirmed) {
        Medication m = new Medication();
        m.setName(name);
        m.setActive(true);
        m.setConfirmed(confirmed);
        return m;
    }

    @Test
    void anUnconfirmedLabValueNeverReachesTheModel() {
        // The repository is asked for confirmed rows only, so an unconfirmed
        // one cannot arrive - which is exactly what this pins.
        when(records.medications(anyLong(), anyLong())).thenReturn(List.of());
        when(labResults.findByFamilyMemberIdAndConfirmedTrueAndDeletedAtIsNullOrderByCollectedAtDesc(
                MEMBER)).thenReturn(List.of(lab("Hemoglobin", "9.1", true)));

        String prompt = context.forMember(MEMBER, USER).prompt();

        assertTrue(prompt.contains("Hemoglobin"));
        verify(labResults)
                .findByFamilyMemberIdAndConfirmedTrueAndDeletedAtIsNullOrderByCollectedAtDesc(MEMBER);
        verify(labResults, never())
                .findByFamilyMemberIdAndDeletedAtIsNullOrderByCollectedAtDesc(anyLong());
    }

    @Test
    void anUnconfirmedMedicationIsFilteredOut() {
        // Medications come back unfiltered from the record service, so the
        // filter has to hold here.
        when(records.medications(anyLong(), anyLong())).thenReturn(List.of(
                medication("Amoksisillin", true),
                medication("Varfarin", false)));
        when(labResults.findByFamilyMemberIdAndConfirmedTrueAndDeletedAtIsNullOrderByCollectedAtDesc(
                anyLong())).thenReturn(List.of());

        String prompt = context.forMember(MEMBER, USER).prompt();

        assertTrue(prompt.contains("Amoksisillin"));
        assertFalse(prompt.contains("Varfarin"),
                "an unreviewed medication must not be presented as one the person takes");
    }

    @Test
    void abnormalResultsAreNotCrowdedOutByNormalOnes() {
        // The cap must not spend itself on normals: a normal result rarely
        // changes an answer and an abnormal one often does.
        when(records.medications(anyLong(), anyLong())).thenReturn(List.of());

        var many = new java.util.ArrayList<LabResult>();
        for (int i = 0; i < 20; i++) many.add(lab("Normal" + i, "5.0", true));
        LabResult high = lab("Xolesterin", "7.2", true);
        high.setAbnormalFlag(AbnormalFlag.HIGH);
        many.add(high);

        when(labResults.findByFamilyMemberIdAndConfirmedTrueAndDeletedAtIsNullOrderByCollectedAtDesc(
                anyLong())).thenReturn(many);

        assertTrue(context.forMember(MEMBER, USER).prompt().contains("Xolesterin"));
    }

    @Test
    void aRecordFailureLeavesTheConversationUngroundedRatherThanBroken() {
        when(familyService.requireMemberAccess(anyLong(), anyLong(), anyBoolean()))
                .thenThrow(new IllegalArgumentException("no access"));
        assertTrue(context.forMember(MEMBER, USER).isEmpty());
    }
}
