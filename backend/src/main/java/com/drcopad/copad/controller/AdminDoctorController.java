package com.drcopad.copad.controller;

import com.drcopad.copad.entity.*;
import com.drcopad.copad.service.DoctorDirectoryService;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Curating the doctor directory.
 *
 * Under /api/admin, the only prefix the security config gates on ADMIN.
 */
@Slf4j
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminDoctorController {

    private final DoctorDirectoryService directory;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DoctorDTO {
        private Long id;
        private String fullName;
        private String slug;
        private String specialtyCode;
        private String qualifications;
        private String licenseNumber;
        private Integer yearsExperience;
        private String bio;
        private String photoUrl;
        private List<String> languages;
        private BigDecimal consultationFee;
        private boolean acceptsBookings;
        private boolean active;
        private List<Long> clinicIds;
        private String source;
        /** Read-only here; it changes through its own endpoint. */
        private VerificationStatus verification;
        private LocalDateTime verifiedAt;
        /** Whether a person has taken ownership of this listing. */
        private boolean claimed;

        static DoctorDTO from(Doctor d) {
            return DoctorDTO.builder()
                    .id(d.getId()).fullName(d.getFullName()).slug(d.getSlug())
                    .specialtyCode(d.getSpecialtyCode()).qualifications(d.getQualifications())
                    .licenseNumber(d.getLicenseNumber()).yearsExperience(d.getYearsExperience())
                    .bio(d.getBio()).photoUrl(d.getPhotoUrl()).languages(splitLanguages(d.getLanguages()))
                    .consultationFee(d.getConsultationFee())
                    .acceptsBookings(d.isAcceptsBookings()).active(d.isActive())
                    .clinicIds(d.getClinics().stream().map(Clinic::getId).toList())
                    .source(d.getSource())
                    .verification(d.getVerification()).verifiedAt(d.getVerifiedAt())
                    .claimed(d.getUser() != null)
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
            d.setAcceptsBookings(acceptsBookings);
            d.setActive(active);
            d.setSource(source);
            return d;
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ClinicDTO {
        private Long id;
        private String name;
        private String slug;
        private String address;
        private String district;
        private String city;
        private String phone;
        private BigDecimal latitude;
        private BigDecimal longitude;
        private String description;
        private boolean active;

        static ClinicDTO from(Clinic c) {
            return ClinicDTO.builder()
                    .id(c.getId()).name(c.getName()).slug(c.getSlug())
                    .address(c.getAddress()).district(c.getDistrict()).city(c.getCity())
                    .phone(c.getPhone()).latitude(c.getLatitude()).longitude(c.getLongitude())
                    .description(c.getDescription()).active(c.isActive())
                    .build();
        }

        Clinic toEntity() {
            Clinic c = new Clinic();
            c.setName(name);
            c.setAddress(address);
            c.setDistrict(district);
            c.setCity(city);
            c.setPhone(phone);
            c.setLatitude(latitude);
            c.setLongitude(longitude);
            c.setDescription(description);
            c.setActive(active);
            return c;
        }
    }

    @Data
    public static class VerificationRequest {
        private VerificationStatus verification;
        private String note;
    }

    // --- Doctors ---------------------------------------------------------

    @GetMapping("/doctors")
    public Page<DoctorDTO> doctors(@RequestParam(defaultValue = "0") int page,
                                   @RequestParam(defaultValue = "25") int size,
                                   @RequestParam(required = false) String specialty,
                                   @RequestParam(required = false) VerificationStatus verification) {
        return directory.list(specialty, verification,
                        PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 100)))
                .map(DoctorDTO::from);
    }

    @PostMapping("/doctors")
    @ResponseStatus(HttpStatus.CREATED)
    public DoctorDTO createDoctor(@RequestBody DoctorDTO body) {
        return DoctorDTO.from(directory.create(body.toEntity(), body.getClinicIds()));
    }

    @PutMapping("/doctors/{id}")
    public DoctorDTO updateDoctor(@PathVariable Long id, @RequestBody DoctorDTO body) {
        return DoctorDTO.from(directory.update(id, body.toEntity(), body.getClinicIds()));
    }

    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {
        directory.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Changes what is claimed about a listing.
     *
     * Its own endpoint, because asserting that credentials were checked is a
     * different act from editing a biography.
     */
    @PostMapping("/doctors/{id}/verification")
    public DoctorDTO verify(@PathVariable Long id, @RequestBody VerificationRequest body) {
        if (body.getVerification() == null) {
            throw new IllegalArgumentException("A verification status is required");
        }
        return DoctorDTO.from(directory.setVerification(id, body.getVerification()));
    }

    // --- Clinics ---------------------------------------------------------

    @GetMapping("/clinics")
    public Page<ClinicDTO> clinics(@RequestParam(defaultValue = "0") int page,
                                   @RequestParam(defaultValue = "25") int size) {
        return directory.listClinics(
                        PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 100)))
                .map(ClinicDTO::from);
    }

    @PostMapping("/clinics")
    @ResponseStatus(HttpStatus.CREATED)
    public ClinicDTO createClinic(@RequestBody ClinicDTO body) {
        return ClinicDTO.from(directory.createClinic(body.toEntity()));
    }

    @PutMapping("/clinics/{id}")
    public ClinicDTO updateClinic(@PathVariable Long id, @RequestBody ClinicDTO body) {
        return ClinicDTO.from(directory.updateClinic(id, body.toEntity()));
    }

    @DeleteMapping("/clinics/{id}")
    public ResponseEntity<Void> deleteClinic(@PathVariable Long id) {
        directory.deleteClinic(id);
        return ResponseEntity.noContent().build();
    }

    /** Stored comma-separated, exposed as a list. */
    private static List<String> splitLanguages(String value) {
        if (value == null || value.isBlank()) return List.of();
        return java.util.Arrays.stream(value.split(","))
                .map(String::trim).filter(v -> !v.isEmpty()).toList();
    }
}
