package com.drcopad.copad.service;

import com.drcopad.copad.entity.*;
import com.drcopad.copad.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * The record a patient chose to share for one appointment.
 *
 * The booking form has asked this since the day it shipped and the answer went
 * nowhere: the doctor's panel showed a "record shared" badge over nothing. This
 * is the other half of that promise.
 *
 * Everything about it is bounded. It is one appointment's worth of access, to
 * one person's record, for the doctor that appointment is with, and only while
 * the appointment stands.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SharedRecordService {

    /**
     * How long after the appointment the record stays readable.
     *
     * Not forever. A doctor writing up the visit needs it for a while
     * afterwards; nobody needs it next year, and consent given for an
     * appointment was not consent for permanent access.
     */
    private static final int DAYS_AFTER = 7;

    private final BookingRepository bookings;
    private final DoctorRepository doctors;
    private final RecordAccessRepository accesses;
    private final MedicalConditionRepository conditions;
    private final AllergyRepository allergies;
    private final MedicationRepository medications;
    private final ImmunizationRepository immunizations;
    private final LabResultRepository labResults;
    private final VitalReadingRepository vitals;

    /**
     * Reads the record behind one appointment.
     *
     * Refuses unless every one of these holds: the appointment is this
     * doctor's, the patient actually ticked the box, the appointment has not
     * been cancelled, and it is inside the window. Each is a separate reason
     * somebody might expect access and not have it.
     */
    @Transactional
    public Map<String, Object> forBooking(Long userId, Long bookingId) {
        Doctor doctor = doctors.findByUserIdAndDeletedAtIsNull(userId)
                .orElseThrow(() -> new AccessDeniedException("This account has no doctor listing"));

        Booking booking = bookings.findById(bookingId)
                .filter(b -> b.getDoctor() != null
                        && b.getDoctor().getId().equals(doctor.getId()))
                .orElseThrow(() -> new AccessDeniedException("Not your appointment"));

        if (!booking.isSharedRecord()) {
            throw new AccessDeniedException("This patient did not share their record");
        }
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            // The booking form says cancelling stops the sharing. It has to.
            throw new AccessDeniedException("This appointment was cancelled");
        }
        if (LocalDateTime.now().isAfter(booking.getEndsAt().plusDays(DAYS_AFTER))) {
            throw new AccessDeniedException("Access to this record has expired");
        }

        FamilyMember member = booking.getFamilyMember();

        RecordAccess entry = new RecordAccess();
        entry.setBooking(booking);
        entry.setDoctor(doctor);
        entry.setFamilyMember(member);
        accesses.save(entry);
        // The patient's name and what was in the record stay out of the log.
        log.info("Doctor {} opened the record shared for booking {}",
                doctor.getId(), bookingId);

        return assemble(member);
    }

    /** What the person who shared can see about who looked. */
    @Transactional(readOnly = true)
    public List<RecordAccess> accessesFor(Long memberId) {
        return accesses.findByFamilyMemberIdOrderByAccessedAtDesc(memberId);
    }

    private Map<String, Object> assemble(FamilyMember member) {
        Map<String, Object> record = new LinkedHashMap<>();
        record.put("patientName", member.getFullName());
        record.put("dateOfBirth", member.getDateOfBirth());
        record.put("biologicalSex", member.getBiologicalSex());
        record.put("bloodType", member.getBloodType());

        record.put("allergies", allergies
                .findByFamilyMemberIdAndDeletedAtIsNullOrderByIdDesc(member.getId())
                .stream().map(a -> Map.of(
                        "allergen", String.valueOf(a.getAllergen()),
                        "type", String.valueOf(a.getAllergenType()),
                        "severity", String.valueOf(a.getSeverity()),
                        "reaction", a.getReaction() == null ? "" : a.getReaction(),
                        "active", a.isActive())).toList());

        record.put("conditions", conditions
                .findByFamilyMemberIdAndDeletedAtIsNullOrderByIdDesc(member.getId())
                .stream().map(c -> Map.of(
                        "label", String.valueOf(c.getLabel()),
                        "status", String.valueOf(c.getStatus()),
                        "severity", String.valueOf(c.getSeverity()))).toList());

        // Unconfirmed entries are marked rather than hidden. A medication read
        // off a photographed prescription that nobody has checked is worth
        // seeing, and worth not trusting; a doctor should be told which it is.
        record.put("medications", medications
                .findByFamilyMemberIdAndDeletedAtIsNullOrderByIdDesc(member.getId())
                .stream().map(m -> Map.of(
                        "name", String.valueOf(m.getName()),
                        "dose", m.getDoseLabel() == null ? "" : m.getDoseLabel(),
                        "frequency", m.getFrequency() == null ? "" : m.getFrequency(),
                        "active", m.isActive(),
                        "confirmed", m.isConfirmed())).toList());

        record.put("immunizations", immunizations
                .findByFamilyMemberIdAndDeletedAtIsNullOrderByIdDesc(member.getId())
                .stream().map(i -> Map.of(
                        "vaccine", String.valueOf(i.getVaccine()),
                        "administeredOn", String.valueOf(i.getAdministeredOn()))).toList());

        record.put("labResults", labResults
                .findByFamilyMemberIdAndDeletedAtIsNullOrderByCollectedAtDesc(member.getId())
                .stream().limit(40).map(r -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("analyte", r.getAnalyte());
                    row.put("value", r.getValueNumeric() != null
                            ? r.getValueNumeric() : r.getValueText());
                    row.put("unit", r.getUnit());
                    row.put("referenceLow", r.getReferenceLow());
                    row.put("referenceHigh", r.getReferenceHigh());
                    row.put("abnormal", r.getAbnormalFlag());
                    row.put("collectedAt", r.getCollectedAt());
                    row.put("confirmed", r.isConfirmed());
                    return row;
                }).toList());

        record.put("vitals", vitals
                .findByFamilyMemberIdAndDeletedAtIsNullOrderByMeasuredAtDesc(member.getId())
                .stream().limit(30).map(v -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("type", v.getVitalType());
                    row.put("value", v.getValueCanonical());
                    row.put("unit", v.getUnitCanonical());
                    row.put("measuredAt", v.getMeasuredAt());
                    row.put("abnormal", v.getAbnormalFlag());
                    row.put("source", v.getSource());
                    return row;
                }).toList());

        return record;
    }
}
