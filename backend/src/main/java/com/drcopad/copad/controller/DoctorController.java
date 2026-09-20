package com.drcopad.copad.controller;

import com.drcopad.copad.entity.Clinic;
import com.drcopad.copad.entity.Doctor;
import com.drcopad.copad.entity.VerificationStatus;
import com.drcopad.copad.repository.DoctorRepository;
import com.drcopad.copad.repository.SpecialtyRepository;
import com.drcopad.copad.util.ClientIpResolver;
import com.drcopad.copad.service.AvailabilityService;
import com.drcopad.copad.service.ViewCounterService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
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
    private final SpecialtyRepository specialties;
    private final ViewCounterService views;

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
        /** How many times this profile has been opened. */
        private long viewCount;
        /** Null until somebody has actually left a review. */
        private Double rating;
        private int reviewCount;
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
                    .viewCount(d.getViewCount())
                    // An average nobody gave us is not a rating, so a doctor
                    // with no reviews has none rather than a default five.
                    .rating(d.getReviewCount() == 0 ? null
                            : Math.round(d.getRatingTotal() * 10.0 / d.getReviewCount()) / 10.0)
                    .reviewCount(d.getReviewCount())
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
            @RequestParam(required = false) String clinic,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return doctors.publicSearch(blank(specialty), blank(city), blank(clinic), blank(language), blank(q),
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
     * "Somebody opened this profile."
     *
     * Its own call, made by the reader's browser, because the profile itself
     * is served from a cache: counting inside that request would count one
     * visit per five minutes however many people arrived. Coming from the
     * browser also means the address and the user agent are the reader's own,
     * which is what the crawler and repeat checks need.
     */
    @PostMapping("/{slug}/view")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void recordView(@PathVariable String slug, HttpServletRequest request) {
        doctors.findBySlugAndDeletedAtIsNull(slug)
                .filter(Doctor::isActive)
                .ifPresent(doctor -> views.doctorViewed(doctor.getId(),
                        request.getHeader("User-Agent"), ClientIpResolver.resolve(request)));
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

    /**
     * The directory's specialty list, named in the language being read.
     *
     * The frontend used to carry its own table of these, which covered
     * fourteen of the forty-three; the rest rendered as their raw code, so a
     * card read "anesthesiology" instead of the specialty's name. The names
     * live in one place now, beside the codes they belong to.
     *
     * Sits under /api/doctors because that prefix is already public. A literal
     * path wins over /{slug}, so no doctor can shadow it.
     */
    @GetMapping("/specialties")
    public List<Map<String, Object>> specialties(
            @RequestParam(defaultValue = "az") String lang) {
        String language = switch (lang == null ? "" : lang.toLowerCase()) {
            case "en", "ru" -> lang.toLowerCase();
            default -> "az";
        };
        return specialties.findByActiveTrueOrderBySortOrderAscNameEnAsc().stream()
                .map(sp -> Map.<String, Object>of(
                        "code", sp.getCode(),
                        "name", switch (language) {
                            case "en" -> sp.getNameEn();
                            // Russian is optional in the table; fall back to the
                            // Azerbaijani name rather than to a bare code.
                            case "ru" -> sp.getNameRu() == null || sp.getNameRu().isBlank()
                                    ? sp.getNameAz() : sp.getNameRu();
                            default -> sp.getNameAz();
                        },
                        "patientFacing", sp.isPatientFacing()))
                .toList();
    }

    /**
     * The hospitals in the directory, for the filter on the listing page.
     *
     * A person is usually told where to go before they are told who to see -
     * "go to the oncology clinic at the medical university" - so the hospital
     * is the filter that matches how the referral actually arrives.
     *
     * Each entry carries its number of doctors, counted through the same rules
     * that decide what the directory shows, so the control cannot offer a
     * hospital and then return nothing. Names are the clinics' own and are not
     * translated.
     */
    @GetMapping("/clinics")
    public List<Map<String, Object>> clinics() {
        return doctors.publicClinics().stream()
                .map(row -> Map.<String, Object>of(
                        "slug", row[0],
                        "name", row[1],
                        "city", row[2] == null ? "" : row[2],
                        "doctors", row[3]))
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

    /**
     * The languages a doctor works in, never empty.
     *
     * Where it is unrecorded the answer is Azerbaijani: every clinic in this
     * directory is in Azerbaijan and works in it. An empty list read as "speaks
     * nothing", which dropped the doctor from every language filter and left
     * the profile with a blank where the answer is obvious.
     */
    private static List<String> splitLanguages(String value) {
        if (value == null || value.isBlank()) return List.of("az");
        List<String> parsed = Arrays.stream(value.split(",")).map(String::trim)
                .filter(v -> !v.isEmpty()).toList();
        return parsed.isEmpty() ? List.of("az") : parsed;
    }

    private String blank(String value) {
        return value == null || value.isBlank() ? null : value;
    }
}
