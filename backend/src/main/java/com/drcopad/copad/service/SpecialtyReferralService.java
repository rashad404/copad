package com.drcopad.copad.service;

import com.drcopad.copad.repository.DoctorRepository;
import com.drcopad.copad.repository.MedicalSpecialtyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Tells the assistant which kind of doctor a person needs.
 *
 * It already works out that somebody should be seen; what it could not do was
 * say by whom, in terms this product can act on. Naming a specialty is what
 * turns "see a doctor" into something with a next step.
 *
 * The block reflects what the directory actually holds. With no doctors in a
 * specialty, the assistant names it and stops; it must not offer to find
 * somebody who is not there. A promise the product cannot keep is worse than no
 * offer, and it is the kind of thing that only breaks in front of a real person.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SpecialtyReferralService {

    private final MedicalSpecialtyRepository specialties;
    private final DoctorRepository doctors;

    /**
     * The specialty vocabulary, with what the directory can offer for each.
     *
     * Cached for the length of a request rather than held: the counts change
     * as doctors are added, and a stale zero would keep the assistant quiet
     * about a directory that had filled up.
     */
    @Transactional(readOnly = true)
    public String context() {
        Map<String, Long> available = new LinkedHashMap<>();

        specialties.findAll().stream()
                .filter(s -> s.isActive() && s.getCode() != null && s.getName() != null)
                // The duplicate row whose name is just "general" carries no
                // meaning for a referral.
                .filter(s -> !s.getCode().equalsIgnoreCase("generalhealth"))
                .forEach(s -> available.put(
                        s.getCode() + " (" + s.getName() + ")",
                        countFor(s.getCode())));

        if (available.isEmpty()) return "";

        StringBuilder block = new StringBuilder("""

                REFERRAL
                When somebody should see a doctor, say which kind. Use these names:
                """);

        // Marked per specialty rather than described in general. Told only that
        // some specialties have doctors, the model offered to find a
        // dermatologist on azdoc when there were none - it generalised from a
        // rule that was true of a different specialty. Each line now carries its
        // own answer, so there is nothing to generalise from.
        available.forEach((label, count) -> {
            block.append("- ").append(label);
            block.append(count > 0
                    ? " - " + count + " listed on azdoc, may be suggested"
                    : " - NOT on azdoc, name the specialty only");
            block.append("\n");
        });

        block.append("""

                Rules:
                - Only say a doctor can be found on azdoc for a specialty marked
                  "listed on azdoc". For any specialty marked "NOT on azdoc", name it and
                  stop: do not suggest searching, filtering or booking here for it.
                - Never name an individual doctor.
                - Telling somebody they can find a doctor here when they cannot sends them
                  to an empty page while they are unwell.
                """);
        return block.toString();
    }

    private long countFor(String code) {
        try {
            return doctors.publicSearch(code, null, null, null, PageRequest.of(0, 1))
                    .getTotalElements();
        } catch (RuntimeException e) {
            // A referral is worth making even when the count is unavailable;
            // treating it as zero simply keeps the assistant from over-promising.
            log.warn("Could not count doctors for {}: {}", code, e.getClass().getSimpleName());
            return 0;
        }
    }
}
