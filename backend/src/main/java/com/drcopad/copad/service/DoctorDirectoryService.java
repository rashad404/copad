package com.drcopad.copad.service;

import com.drcopad.copad.entity.*;
import com.drcopad.copad.repository.ClinicRepository;
import com.drcopad.copad.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Locale;

/**
 * Curating the directory.
 *
 * A listing may be created before the doctor has any involvement, because a
 * directory has to start somewhere. That makes two things this service's job:
 * a listing never claims more than is known about it, and it never takes
 * appointments nobody is watching.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DoctorDirectoryService {

    private final DoctorRepository doctors;
    private final ClinicRepository clinics;

    @Transactional(readOnly = true)
    public Page<Doctor> list(String specialty, VerificationStatus verification, Pageable pageable) {
        return doctors.search(blankToNull(specialty), verification, pageable);
    }

    @Transactional
    public Doctor create(Doctor input, java.util.List<Long> clinicIds) {
        if (input.getFullName() == null || input.getFullName().isBlank()) {
            throw new IllegalArgumentException("A name is required");
        }

        Doctor doctor = new Doctor();
        apply(doctor, input, clinicIds);
        doctor.setSlug(uniqueSlug(input.getFullName()));

        // Always. A listing an administrator typed in describes somebody who
        // has not been asked, whatever was posted alongside it.
        doctor.setVerification(VerificationStatus.UNCLAIMED);
        doctor.setVerifiedAt(null);

        Doctor saved = doctors.save(doctor);
        log.info("Doctor listing {} created, unclaimed", saved.getId());
        return saved;
    }

    @Transactional
    public Doctor update(Long id, Doctor input, java.util.List<Long> clinicIds) {
        Doctor doctor = doctors.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));
        // Verification is deliberately not taken from the form. It changes
        // through its own endpoint, so it cannot be granted by editing a field.
        apply(doctor, input, clinicIds);
        return doctors.save(doctor);
    }

    /**
     * Changes what is claimed about a listing.
     *
     * Separate from editing because it is a different act: everything else
     * describes the doctor, this asserts what we have checked.
     */
    @Transactional
    public Doctor setVerification(Long id, VerificationStatus status) {
        Doctor doctor = doctors.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));

        doctor.setVerification(status);
        doctor.setVerifiedAt(status == VerificationStatus.VERIFIED ? LocalDateTime.now() : null);

        // Losing verification also stops appointments. Continuing to take them
        // for somebody we no longer vouch for is the wrong default.
        if (status != VerificationStatus.VERIFIED) {
            doctor.setAcceptsBookings(false);
        }

        log.info("Doctor {} verification set to {}", id, status);
        return doctors.save(doctor);
    }

    @Transactional
    public void delete(Long id) {
        doctors.findByIdAndDeletedAtIsNull(id).ifPresent(doctor -> {
            doctor.setDeletedAt(LocalDateTime.now());
            doctor.setActive(false);
            doctor.setAcceptsBookings(false);
            doctors.save(doctor);
        });
    }

    private void apply(Doctor doctor, Doctor input, java.util.List<Long> clinicIds) {
        doctor.setFullName(input.getFullName());
        doctor.setSpecialtyCode(input.getSpecialtyCode());
        doctor.setQualifications(input.getQualifications());
        doctor.setLicenseNumber(input.getLicenseNumber());
        doctor.setYearsExperience(input.getYearsExperience());
        doctor.setBio(input.getBio());
        doctor.setPhotoUrl(input.getPhotoUrl());
        doctor.setLanguages(input.getLanguages());
        doctor.setConsultationFee(input.getConsultationFee());
        doctor.setSource(input.getSource());
        doctor.setActive(input.isActive());

        // Only a verified doctor may take appointments. Anything else would be
        // offering a booking on the strength of a name somebody typed in.
        doctor.setAcceptsBookings(
                input.isAcceptsBookings() && doctor.getVerification() == VerificationStatus.VERIFIED);

        if (clinicIds != null) {
            doctor.setClinics(new HashSet<>(clinics.findAllById(clinicIds)));
        }
    }

    // --- Clinics ---------------------------------------------------------

    @Transactional(readOnly = true)
    public Page<Clinic> listClinics(Pageable pageable) {
        return clinics.findByDeletedAtIsNullOrderByNameAsc(pageable);
    }

    @Transactional
    public Clinic createClinic(Clinic input) {
        if (input.getName() == null || input.getName().isBlank()) {
            throw new IllegalArgumentException("A name is required");
        }
        input.setId(null);
        input.setSlug(uniqueClinicSlug(input.getName()));
        return clinics.save(input);
    }

    @Transactional
    public Clinic updateClinic(Long id, Clinic input) {
        Clinic clinic = clinics.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new IllegalArgumentException("Clinic not found"));
        clinic.setName(input.getName());
        clinic.setAddress(input.getAddress());
        clinic.setDistrict(input.getDistrict());
        clinic.setCity(input.getCity());
        clinic.setPhone(input.getPhone());
        clinic.setLatitude(input.getLatitude());
        clinic.setLongitude(input.getLongitude());
        clinic.setDescription(input.getDescription());
        clinic.setActive(input.isActive());
        return clinics.save(clinic);
    }

    @Transactional
    public void deleteClinic(Long id) {
        clinics.findByIdAndDeletedAtIsNull(id).ifPresent(clinic -> {
            clinic.setDeletedAt(LocalDateTime.now());
            clinic.setActive(false);
            clinics.save(clinic);
        });
    }

    /**
     * A readable, stable URL for a name.
     *
     * Two doctors share a name often enough that the collision has to be
     * handled rather than hoped against.
     */
    private String uniqueSlug(String name) {
        String base = slugify(name);
        String slug = base;
        int n = 2;
        while (doctors.existsBySlug(slug)) slug = base + "-" + n++;
        return slug;
    }

    private String uniqueClinicSlug(String name) {
        String base = slugify(name);
        String slug = base;
        int n = 2;
        while (clinics.existsBySlug(slug)) slug = base + "-" + n++;
        return slug;
    }

    private String slugify(String value) {
        String s = value.toLowerCase(Locale.ROOT)
                .replace("ə", "e").replace("ı", "i").replace("ğ", "g")
                .replace("ş", "s").replace("ç", "c").replace("ö", "o").replace("ü", "u");
        s = Normalizer.normalize(s, Normalizer.Form.NFD).replaceAll("\\p{M}", "");
        s = s.replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
        return s.isEmpty() ? "doctor" : s;
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value;
    }
}
