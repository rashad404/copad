package com.drcopad.copad.controller;

import com.drcopad.copad.entity.*;
import com.drcopad.copad.service.DoctorSelfService;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * A doctor managing their own listing.
 *
 * Separate from the admin controller on purpose. Everything here is something a
 * doctor may say about themselves; nothing here can grant verification or open
 * bookings on an unverified listing, because both are claims only we can make.
 */
@Slf4j
@RestController
@RequestMapping("/api/doctor")
@RequiredArgsConstructor
public class DoctorSelfController {

    private final DoctorSelfService self;
    private final com.drcopad.copad.service.SharedRecordService sharedRecords;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MyListingDTO {
        private Long id;
        private String slug;
        private String fullName;
        private String specialtyCode;
        private String qualifications;
        private String licenseNumber;
        private Integer yearsExperience;
        private String bio;
        private String photoUrl;
        private List<String> languages;
        private BigDecimal consultationFee;
        /**
         * Boxed so "not sent" and "sent as false" are different things.
         *
         * As a primitive this defaulted to false on every partial update, so a
         * doctor editing their biography silently stopped taking appointments.
         */
        private Boolean acceptsBookings;
        private boolean active;
        /** Read-only. Only a review can change it. */
        private VerificationStatus verification;
        private LocalDateTime verifiedAt;
        /**
         * What the doctor still needs to know: an unverified listing is public
         * but carries its status, and cannot take appointments.
         */
        private String statusExplanation;

        static MyListingDTO from(Doctor d) {
            return MyListingDTO.builder()
                    .id(d.getId()).slug(d.getSlug()).fullName(d.getFullName())
                    .specialtyCode(d.getSpecialtyCode()).qualifications(d.getQualifications())
                    .licenseNumber(d.getLicenseNumber()).yearsExperience(d.getYearsExperience())
                    .bio(d.getBio()).photoUrl(d.getPhotoUrl())
                    .languages(split(d.getLanguages()))
                    .consultationFee(d.getConsultationFee())
                    .acceptsBookings(d.isAcceptsBookings()).active(d.isActive())
                    .verification(d.getVerification()).verifiedAt(d.getVerifiedAt())
                    .statusExplanation(explain(d.getVerification()))
                    .build();
        }

        Doctor toEntity() {
            Doctor d = new Doctor();
            d.setFullName(fullName);
            d.setSpecialtyCode(specialtyCode);
            d.setQualifications(qualifications);
            d.setLicenseNumber(licenseNumber);
            d.setYearsExperience(yearsExperience);
            d.setBio(bio);
            d.setPhotoUrl(photoUrl);
            d.setLanguages(languages == null || languages.isEmpty()
                    ? null : String.join(",", languages));
            d.setConsultationFee(consultationFee);
            // Null means the caller did not mention it; leave it alone.
            d.setAcceptsBookings(Boolean.TRUE.equals(acceptsBookings));
            return d;
        }

        private static String explain(VerificationStatus status) {
            return switch (status) {
                case PENDING -> "Your listing is awaiting review. It is visible and marked "
                        + "as unverified, and cannot take appointments yet.";
                case VERIFIED -> "Your listing is verified. You can turn appointments on and off.";
                case REJECTED -> "This listing was not approved. Please get in touch.";
                case UNCLAIMED -> "This listing has not been claimed.";
            };
        }

        private static List<String> split(String value) {
            if (value == null || value.isBlank()) return List.of();
            return Arrays.stream(value.split(",")).map(String::trim)
                    .filter(v -> !v.isEmpty()).toList();
        }
    }

    @Data
    public static class ClaimRequest {
        private Long doctorId;
        /** Anything supporting the claim, for whoever reviews it. */
        private String evidence;
    }

    @Data
    public static class AvailabilityRequest {
        private int dayOfWeek;
        private LocalTime startTime;
        private LocalTime endTime;
        private int slotMinutes = 20;
        private Long clinicId;
    }

    @GetMapping("/me")
    public ResponseEntity<MyListingDTO> me(@AuthenticationPrincipal User user) {
        Doctor doctor = self.mine(user.getId());
        return doctor == null
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(MyListingDTO.from(doctor));
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public MyListingDTO register(@RequestBody MyListingDTO body,
                                 @AuthenticationPrincipal User user) {
        return MyListingDTO.from(self.register(user.getId(), body.toEntity()));
    }

    /**
     * Claims a listing created from a public source.
     *
     * Puts it under review. It does not verify anybody, and the listing takes no
     * appointments until somebody has checked.
     */
    @PostMapping("/claim")
    public MyListingDTO claim(@RequestBody ClaimRequest body,
                              @AuthenticationPrincipal User user) {
        if (body.getDoctorId() == null) {
            throw new IllegalArgumentException("A listing is required");
        }
        return MyListingDTO.from(self.claim(body.getDoctorId(), user.getId(), body.getEvidence()));
    }

    @PutMapping("/me")
    public MyListingDTO updateMe(@RequestBody MyListingDTO body,
                                 @AuthenticationPrincipal User user) {
        return MyListingDTO.from(self.updateMine(user.getId(), body.toEntity(),
                body.getAcceptsBookings() != null));
    }

    @GetMapping("/me/availability")
    public List<Map<String, Object>> availability(@AuthenticationPrincipal User user) {
        return self.myAvailability(user.getId()).stream().map(a -> Map.<String, Object>of(
                "id", a.getId(),
                "dayOfWeek", a.getDayOfWeek(),
                "startTime", a.getStartTime().toString(),
                "endTime", a.getEndTime().toString(),
                "slotMinutes", a.getSlotMinutes(),
                "clinicId", a.getClinic() == null ? "" : a.getClinic().getId(),
                "active", a.isActive())).toList();
    }

    @PostMapping("/me/availability")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> addAvailability(@RequestBody AvailabilityRequest body,
                                               @AuthenticationPrincipal User user) {
        DoctorAvailability saved = self.addAvailability(user.getId(), body.getDayOfWeek(),
                body.getStartTime(), body.getEndTime(), body.getSlotMinutes(), body.getClinicId());
        return Map.of("id", saved.getId(), "dayOfWeek", saved.getDayOfWeek(),
                "startTime", saved.getStartTime().toString(),
                "endTime", saved.getEndTime().toString(),
                "slotMinutes", saved.getSlotMinutes());
    }

    @DeleteMapping("/me/availability/{id}")
    public ResponseEntity<Void> removeAvailability(@PathVariable Long id,
                                                   @AuthenticationPrincipal User user) {
        self.removeAvailability(user.getId(), id);
        return ResponseEntity.noContent().build();
    }

    /** Appointments booked with this doctor. */
    @GetMapping("/me/bookings")
    public List<Map<String, Object>> myBookings(@AuthenticationPrincipal User user) {
        return self.myBookings(user.getId()).stream().map(b -> {
            Map<String, Object> row = new java.util.LinkedHashMap<String, Object>();
            row.put("id", b.getId());
            row.put("startsAt", b.getStartsAt());
            row.put("endsAt", b.getEndsAt());
            row.put("status", b.getStatus());
            row.put("reason", b.getReason());
            // The patient's name only, and only because they are coming to see
            // this doctor. Their record is shared separately and per booking.
            row.put("patientName", b.getFamilyMember() == null
                    ? null : b.getFamilyMember().getFullName());
            row.put("recordShared", b.isSharedRecord());
            return row;
        }).toList();
    }

    @Data
    public static class TimeOffRequest {
        private LocalDateTime startsAt;
        private LocalDateTime endsAt;
        private String reason;
    }

    /** Periods the doctor is away. Availability already respects these. */
    @GetMapping("/me/time-off")
    public List<Map<String, Object>> timeOff(@AuthenticationPrincipal User user) {
        return self.myTimeOff(user.getId()).stream().map(t -> Map.<String, Object>of(
                "id", t.getId(),
                "startsAt", t.getStartsAt(),
                "endsAt", t.getEndsAt(),
                "reason", t.getReason() == null ? "" : t.getReason())).toList();
    }

    @PostMapping("/me/time-off")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> addTimeOff(@RequestBody TimeOffRequest body,
                                          @AuthenticationPrincipal User user) {
        DoctorTimeOff saved = self.addTimeOff(user.getId(), body.getStartsAt(),
                body.getEndsAt(), body.getReason());
        return Map.of("id", saved.getId(),
                "startsAt", saved.getStartsAt(),
                "endsAt", saved.getEndsAt());
    }

    @DeleteMapping("/me/time-off/{id}")
    public ResponseEntity<Void> removeTimeOff(@PathVariable Long id,
                                              @AuthenticationPrincipal User user) {
        self.removeTimeOff(user.getId(), id);
        return ResponseEntity.noContent().build();
    }

    /**
     * The record the patient chose to share for this appointment.
     *
     * Refused unless the appointment is this doctor's, the patient actually
     * shared, the appointment stands, and it is inside the window. The panel
     * has shown a "record shared" badge since booking shipped and there was
     * nothing behind it.
     */
    @GetMapping("/me/bookings/{id}/record")
    public Map<String, Object> sharedRecord(@PathVariable Long id,
                                            @AuthenticationPrincipal User user) {
        return sharedRecords.forBooking(user.getId(), id);
    }

    @Data
    public static class DecisionRequest {
        /** Only shown to the person who asked, so they know why. */
        private String reason;
    }

    /**
     * Accepts an appointment request.
     *
     * Until this existed a booking could be asked for but never answered, so
     * every appointment sat in REQUESTED and nobody could tell whether they
     * were expected.
     */
    @PostMapping("/me/bookings/{id}/confirm")
    public Map<String, Object> confirmBooking(@PathVariable Long id,
                                              @AuthenticationPrincipal User user) {
        Booking saved = self.decide(user.getId(), id, true, null);
        return Map.of("id", saved.getId(), "status", saved.getStatus());
    }

    /** Declines it, which cancels the appointment and frees the time. */
    @PostMapping("/me/bookings/{id}/decline")
    public Map<String, Object> declineBooking(@PathVariable Long id,
                                              @RequestBody(required = false) DecisionRequest body,
                                              @AuthenticationPrincipal User user) {
        Booking saved = self.decide(user.getId(), id, false,
                body == null ? null : body.getReason());
        return Map.of("id", saved.getId(), "status", saved.getStatus());
    }
}
