package com.drcopad.copad.service;

import com.drcopad.copad.entity.*;
import com.drcopad.copad.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.time.LocalTime;
import java.util.List;
import java.util.Locale;

/**
 * A doctor registering, or claiming the listing we made about them.
 *
 * The risk this service exists to contain: anybody with an account could
 * otherwise assert they are a named doctor and acquire a profile that looks
 * official. So claiming and registering both end at PENDING and never at
 * VERIFIED. Only an administrator, having checked something, can say we vouch
 * for a person - and until they do, the listing carries its unverified status
 * and takes no appointments.
 *
 * A claim is a request, not a grant. That distinction is the whole design.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DoctorSelfService {

    private final DoctorRepository doctors;
    private final DoctorAvailabilityRepository availability;
    private final ClinicRepository clinics;
    private final BookingRepository bookings;
    private final UserRepository users;

    /** The caller's own listing, or null when they have none. */
    @Transactional(readOnly = true)
    public Doctor mine(Long userId) {
        return doctors.findByUserIdAndDeletedAtIsNull(userId).orElse(null);
    }

    /**
     * Creates a listing for the person asking.
     *
     * PENDING, because nobody has checked anything yet.
     */
    @Transactional
    public Doctor register(Long userId, Doctor input) {
        if (doctors.findByUserIdAndDeletedAtIsNull(userId).isPresent()) {
            throw new IllegalArgumentException("This account already has a doctor listing");
        }
        if (input.getFullName() == null || input.getFullName().isBlank()) {
            throw new IllegalArgumentException("A name is required");
        }

        User user = users.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        Doctor doctor = new Doctor();
        doctor.setUser(user);
        doctor.setSlug(uniqueSlug(input.getFullName()));
        applyOwnFields(doctor, input);

        // Awaiting review, never verified on the strength of a form.
        doctor.setVerification(VerificationStatus.PENDING);
        doctor.setAcceptsBookings(false);
        doctor.setActive(true);
        doctor.setSource("self-registered");

        Doctor saved = doctors.save(doctor);
        log.info("Doctor listing {} self-registered, pending review", saved.getId());
        return saved;
    }

    /**
     * Claims a listing somebody else created.
     *
     * The listing must be unclaimed, and claiming it asserts nothing beyond a
     * request to be reviewed. A rejected listing cannot be claimed: refusing a
     * claim and then allowing another attempt on the same entry would make the
     * refusal meaningless.
     */
    @Transactional
    public Doctor claim(Long doctorId, Long userId, String evidence) {
        if (doctors.findByUserIdAndDeletedAtIsNull(userId).isPresent()) {
            throw new IllegalArgumentException("This account already has a doctor listing");
        }

        Doctor doctor = doctors.findByIdAndDeletedAtIsNull(doctorId)
                .orElseThrow(() -> new IllegalArgumentException("Listing not found"));

        if (doctor.getUser() != null) {
            throw new IllegalArgumentException("This listing has already been claimed");
        }
        if (doctor.getVerification() != VerificationStatus.UNCLAIMED) {
            throw new IllegalArgumentException("This listing is not open to be claimed");
        }

        User user = users.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        doctor.setUser(user);
        doctor.setVerification(VerificationStatus.PENDING);
        // Still no appointments. A claim is not a credential.
        doctor.setAcceptsBookings(false);
        if (evidence != null && !evidence.isBlank()) {
            doctor.setBio(doctor.getBio() == null ? evidence : doctor.getBio());
        }

        Doctor saved = doctors.save(doctor);
        log.info("Doctor listing {} claimed by user {}, pending review", doctorId, userId);
        return saved;
    }

    /**
     * Edits the caller's own listing.
     *
     * Verification is untouchable here, and so is whether the listing takes
     * appointments unless it is verified. Otherwise editing your own profile
     * would be a way to grant yourself both.
     */
    @Transactional
    public Doctor updateMine(Long userId, Doctor input) {
        Doctor doctor = require(userId);
        applyOwnFields(doctor, input);

        // A verified doctor may pause their own bookings: they know when they
        // are away. Nobody else may turn them on.
        doctor.setAcceptsBookings(
                doctor.getVerification() == VerificationStatus.VERIFIED && input.isAcceptsBookings());

        return doctors.save(doctor);
    }

    // --- Availability ----------------------------------------------------

    @Transactional(readOnly = true)
    public List<DoctorAvailability> myAvailability(Long userId) {
        return availability.findByDoctorId(require(userId).getId());
    }

    @Transactional
    public DoctorAvailability addAvailability(Long userId, int dayOfWeek, LocalTime start,
                                              LocalTime end, int slotMinutes, Long clinicId) {
        Doctor doctor = require(userId);

        if (dayOfWeek < 1 || dayOfWeek > 7) {
            throw new IllegalArgumentException("A day between 1 and 7 is required");
        }
        if (start == null || end == null || !end.isAfter(start)) {
            throw new IllegalArgumentException("The end time must be after the start time");
        }
        if (slotMinutes < 5 || slotMinutes > 240) {
            throw new IllegalArgumentException("An appointment length between 5 and 240 minutes is required");
        }

        DoctorAvailability block = new DoctorAvailability();
        block.setDoctor(doctor);
        block.setDayOfWeek(dayOfWeek);
        block.setStartTime(start);
        block.setEndTime(end);
        block.setSlotMinutes(slotMinutes);
        block.setActive(true);
        if (clinicId != null) {
            clinics.findByIdAndDeletedAtIsNull(clinicId).ifPresent(block::setClinic);
        }
        return availability.save(block);
    }

    @Transactional
    public void removeAvailability(Long userId, Long availabilityId) {
        Doctor doctor = require(userId);
        availability.findById(availabilityId)
                .filter(a -> a.getDoctor().getId().equals(doctor.getId()))
                .ifPresent(availability::delete);
    }

    /** Appointments booked with the caller. */
    @Transactional(readOnly = true)
    public List<Booking> myBookings(Long userId) {
        Doctor doctor = require(userId);
        return bookings.findByDoctorIdAndStatusInAndStartsAtBetween(
                doctor.getId(),
                List.of(BookingStatus.REQUESTED, BookingStatus.CONFIRMED),
                java.time.LocalDateTime.now().minusDays(30),
                java.time.LocalDateTime.now().plusDays(120));
    }

    private Doctor require(Long userId) {
        Doctor doctor = doctors.findByUserIdAndDeletedAtIsNull(userId).orElse(null);
        if (doctor == null) {
            throw new AccessDeniedException("This account has no doctor listing");
        }
        return doctor;
    }

    /** The fields a doctor may set about themselves. */
    private void applyOwnFields(Doctor doctor, Doctor input) {
        doctor.setFullName(input.getFullName());
        doctor.setSpecialtyCode(input.getSpecialtyCode());
        doctor.setQualifications(input.getQualifications());
        doctor.setLicenseNumber(input.getLicenseNumber());
        doctor.setYearsExperience(input.getYearsExperience());
        doctor.setBio(input.getBio());
        doctor.setPhotoUrl(input.getPhotoUrl());
        doctor.setLanguages(input.getLanguages());
        doctor.setConsultationFee(input.getConsultationFee());
    }

    private String uniqueSlug(String name) {
        String base = name.toLowerCase(Locale.ROOT)
                .replace("ə", "e").replace("ı", "i").replace("ğ", "g")
                .replace("ş", "s").replace("ç", "c").replace("ö", "o").replace("ü", "u");
        base = Normalizer.normalize(base, Normalizer.Form.NFD).replaceAll("\\p{M}", "");
        base = base.replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
        if (base.isEmpty()) base = "doctor";

        String slug = base;
        int n = 2;
        while (doctors.existsBySlug(slug)) slug = base + "-" + n++;
        return slug;
    }
}
