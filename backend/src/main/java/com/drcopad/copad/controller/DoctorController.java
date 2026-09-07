package com.drcopad.copad.controller;

import com.drcopad.copad.entity.Clinic;
import com.drcopad.copad.entity.Doctor;
import com.drcopad.copad.entity.VerificationStatus;
import com.drcopad.copad.repository.DoctorRepository;
import com.drcopad.copad.service.AvailabilityService;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * The public doctor directory.
 *
 * Public because the point is to be found: a person searching for a
 * cardiologist in Baku should reach a page, and those pages are what make a
 * clinic take the call.
 *
 * What it will not publish about a real named person: a licence number, and any
 * hint of who claimed the listing. What it must publish: the verification
 * status, unedited, because most entries describe doctors who were never asked
 * and presenting them as endorsed would be a claim with nothing behind it.
 */
@Slf4j
@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorRepository doctors;
    private final AvailabilityService availability;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PublicClinicDTO {
        private String slug;
        private String name;
        private String address;
        private String district;
        private String city;
        private String phone;

        static PublicClinicDTO from(Clinic c) {
            return PublicClinicDTO.builder()
                    .slug(c.getSlug()).name(c.getName()).address(c.getAddress())
                    .district(c.getDistrict()).city(c.getCity()).phone(c.getPhone())
                    .build();
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PublicDoctorDTO {
        private Long id;
        private String slug;
        private String fullName;
        private String specialtyCode;
        private String qualifications;
        private Integer yearsExperience;
        private String bio;
        private String photoUrl;
        private List<String> languages;
        private BigDecimal consultationFee;
        /**
         * Published deliberately. UNCLAIMED means this person never agreed to be
         * listed and has confirmed nothing; hiding that would be the dishonest
         * choice, not the discreet one.
         */
        private VerificationStatus verification;
        private boolean acceptsBookings;
        private List<PublicClinicDTO> clinics;

        static PublicDoctorDTO from(Doctor d) {
            return PublicDoctorDTO.builder()
                    .id(d.getId()).slug(d.getSlug()).fullName(d.getFullName())
                    .specialtyCode(d.getSpecialtyCode())
                    .qualifications(d.getQualifications())
                    .yearsExperience(d.getYearsExperience())
                    .bio(d.getBio()).photoUrl(d.getPhotoUrl())
                    .languages(splitLanguages(d.getLanguages()))
                    .consultationFee(d.getConsultationFee())
                    .verification(d.getVerification())
                    // Whether a booking made here would be real.
                    .acceptsBookings(d.isBookable())
                    .clinics(d.getClinics().stream()
                            .filter(Clinic::isActive)
                            .map(PublicClinicDTO::from).toList())
                    .build();
            // Note: no licence number, and nothing about who claimed it.
        }
    }

    @GetMapping
    public Page<PublicDoctorDTO> search(
            @RequestParam(required = false) String specialty,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return doctors.publicSearch(blank(specialty), blank(city), blank(language), blank(q),
                        PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 50)))
                .map(PublicDoctorDTO::from);
    }

    @GetMapping("/{slug}")
    public PublicDoctorDTO bySlug(@PathVariable String slug) {
        Doctor doctor = doctors.findBySlugAndDeletedAtIsNull(slug)
                .filter(Doctor::isActive)
                // A refused claim is not published, for the same reason it is
                // kept out of the listing.
                .filter(d -> d.getVerification() != VerificationStatus.REJECTED)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));
        return PublicDoctorDTO.from(doctor);
    }

    /**
     * Free appointment times.
     *
     * Empty for a doctor who is not taking bookings, which is most of them.
     * That is not an error and the interface should show the clinic's telephone
     * number instead of a control that leads nowhere.
     */
    @GetMapping("/{id}/slots")
    public List<Map<String, Object>> slots(
            @PathVariable Long id,
            @RequestParam(required = false)
            @org.springframework.format.annotation.DateTimeFormat(iso =
                    org.springframework.format.annotation.DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false)
            @org.springframework.format.annotation.DateTimeFormat(iso =
                    org.springframework.format.annotation.DateTimeFormat.ISO.DATE) LocalDate to) {

        return availability.slotsFor(id, from, to).stream()
                .map(s -> Map.<String, Object>of(
                        "startsAt", s.startsAt(),
                        "endsAt", s.endsAt(),
                        "clinicId", s.clinicId() == null ? "" : s.clinicId()))
                .toList();
    }

    /** Slugs for the sitemap, the same shape the drug catalogue uses. */
    @GetMapping("/sitemap")
    public Map<String, Object> sitemap(@RequestParam(defaultValue = "0") int page,
                                       @RequestParam(defaultValue = "5000") int size) {
        Page<Doctor> found = doctors.publicSlugs(
                PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 20000)));
        return Map.of(
                "total", found.getTotalElements(),
                "page", found.getNumber(),
                "size", found.getSize(),
                "entries", found.getContent().stream()
                        .map(d -> Map.of(
                                "slug", d.getSlug(),
                                "lastModified", d.getUpdatedAt() == null
                                        ? "" : d.getUpdatedAt().toLocalDate().toString()))
                        .toList());
    }

    private static List<String> splitLanguages(String value) {
        if (value == null || value.isBlank()) return List.of();
        return Arrays.stream(value.split(",")).map(String::trim)
                .filter(v -> !v.isEmpty()).toList();
    }

    private String blank(String value) {
        return value == null || value.isBlank() ? null : value;
    }
}
