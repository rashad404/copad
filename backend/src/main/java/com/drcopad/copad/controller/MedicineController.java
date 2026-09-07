package com.drcopad.copad.controller;

import com.drcopad.copad.entity.User;
import com.drcopad.copad.service.MedicineService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * The drug catalogue.
 *
 * Search, detail, prices and generic alternatives are public: they are the
 * published registry, and drug pages are a genuine acquisition channel in a
 * language with little quality health content.
 *
 * The allergy check is not public - it reads a member's medical record.
 */
@Slf4j
@RestController
@RequestMapping("/api/medicines")
@RequiredArgsConstructor
public class MedicineController {

    private final MedicineService medicines;

    @GetMapping
    public List<MedicineService.MedicineSummary> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "20") int limit) {
        return medicines.search(q, limit);
    }

    @GetMapping("/{slug}")
    public Map<String, Object> detail(@PathVariable String slug) {
        return medicines.detail(slug);
    }

    @GetMapping("/{id}/alternatives")
    public List<MedicineService.MedicineSummary> alternatives(
            @PathVariable Long id,
            @RequestParam(defaultValue = "10") int limit) {
        return medicines.alternatives(id, limit);
    }

    /** Advisory only: candidates for a human to judge, not a prescribing check. */
    @GetMapping("/{id}/allergy-check")
    public List<MedicineService.AllergyWarning> allergyCheck(
            @PathVariable Long id,
            @RequestParam Long memberId,
            @AuthenticationPrincipal User user) {
        return medicines.checkAllergies(memberId, user.getId(), id);
    }
}
