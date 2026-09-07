package com.drcopad.copad.service;

import com.drcopad.copad.entity.Allergy;
import com.drcopad.copad.entity.ClinicalSeverity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Drug lookup, pricing, generics, and the allergy check.
 *
 * Reads go through JdbcTemplate rather than JPA: these are wide, read-only,
 * heavily filtered queries over 10k rows joined to 16k prices, and mapping them
 * through entities would fetch far more than any caller needs.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MedicineService {

    private final JdbcTemplate jdbcTemplate;
    private final IngredientNormaliser normaliser;
    private final ClinicalRecordService records;
    private final DrugClassMap drugClasses;

    public record MedicineSummary(Long id, String name, String slug, String activeIngredient,
                                  String atcCode, String manufacturer, String prescriptionStatus,
                                  BigDecimal lowestPrice, Integer priceCount) {
    }

    /** Just enough to build a sitemap entry. */
    public record SitemapEntry(String slug, java.time.LocalDate lastModified) {
    }

    public record PriceOption(String tradeName, String dosage, String form, String packaging,
                              String manufacturer, BigDecimal retailPrice) {
    }

    /**
     * A drug the person is allergic to, or that shares an ingredient with one.
     *
     * Advisory. The catalogue's ingredient text is free-form and an allergy
     * record is whatever someone typed, so this finds candidates for a human to
     * judge - it is not a substitute for a prescriber checking.
     */
    public record AllergyWarning(Long medicineId, String medicineName, String matchedIngredient,
                                 String allergen, ClinicalSeverity severity, boolean critical,
                                 /** INGREDIENT for a name match, CLASS for an ATC-class match. */
                                 String basis) {
    }

    @Transactional(readOnly = true)
    public List<MedicineSummary> search(String query, int limit) {
        if (query == null || query.trim().length() < 2) return List.of();
        String like = "%" + query.trim().toLowerCase() + "%";
        String normalised = normaliser.normalise(query);

        // Ordered so an exact name match beats an ingredient match, which beats
        // a substring hit; otherwise searching "ibuprofen" buries the product
        // actually called Ibuprofen under combination products.
        return jdbcTemplate.query("""
                SELECT m.id, m.name, m.slug, m.active_ingredient, m.atc_code, m.manufacturer,
                       m.prescription_status,
                       (SELECT MIN(p.retail_price) FROM medicine_price p
                         WHERE p.medicine_id = m.id AND p.retail_price IS NOT NULL) AS lowest_price,
                       (SELECT COUNT(*) FROM medicine_price p WHERE p.medicine_id = m.id) AS price_count
                FROM medicine m
                WHERE LOWER(m.name) LIKE ?
                   OR LOWER(m.active_ingredient) LIKE ?
                   OR EXISTS (SELECT 1 FROM medicine_ingredient i
                               WHERE i.medicine_id = m.id AND i.normalised = ?)
                ORDER BY
                    CASE WHEN LOWER(m.name) = ? THEN 0
                         WHEN LOWER(m.name) LIKE ? THEN 1
                         ELSE 2 END,
                    m.name
                LIMIT ?
                """,
                (rs, n) -> new MedicineSummary(
                        rs.getLong("id"), rs.getString("name"), rs.getString("slug"),
                        rs.getString("active_ingredient"), rs.getString("atc_code"),
                        rs.getString("manufacturer"), rs.getString("prescription_status"),
                        rs.getBigDecimal("lowest_price"), rs.getInt("price_count")),
                like, like, normalised, query.trim().toLowerCase(),
                query.trim().toLowerCase() + "%", limit <= 0 ? 20 : limit);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> detail(String slug) {
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(
                "SELECT * FROM medicine WHERE slug = ?", slug);
        if (rows.isEmpty()) throw new IllegalArgumentException("Medicine not found");

        Map<String, Object> medicine = new java.util.HashMap<>(rows.get(0));
        Long id = ((Number) medicine.get("id")).longValue();

        medicine.put("prices", jdbcTemplate.query("""
                SELECT trade_name, dosage, form, packaging, manufacturer, retail_price
                FROM medicine_price WHERE medicine_id = ?
                ORDER BY retail_price IS NULL, retail_price
                """,
                (rs, n) -> new PriceOption(rs.getString("trade_name"), rs.getString("dosage"),
                        rs.getString("form"), rs.getString("packaging"),
                        rs.getString("manufacturer"), rs.getBigDecimal("retail_price")), id));

        medicine.put("alternatives", alternatives(id, 10));
        return medicine;
    }

    /**
     * Other products sharing an active ingredient, cheapest first.
     *
     * This is the part of the catalogue with immediate value: the same
     * ingredient is often sold at several times the price under another name.
     */
    @Transactional(readOnly = true)
    public List<MedicineSummary> alternatives(Long medicineId, int limit) {
        return jdbcTemplate.query("""
                SELECT DISTINCT m.id, m.name, m.slug, m.active_ingredient, m.atc_code,
                       m.manufacturer, m.prescription_status,
                       (SELECT MIN(p.retail_price) FROM medicine_price p
                         WHERE p.medicine_id = m.id AND p.retail_price IS NOT NULL) AS lowest_price,
                       (SELECT COUNT(*) FROM medicine_price p WHERE p.medicine_id = m.id) AS price_count
                FROM medicine m
                JOIN medicine_ingredient mi ON mi.medicine_id = m.id
                WHERE mi.normalised IN (SELECT normalised FROM medicine_ingredient WHERE medicine_id = ?)
                  AND m.id <> ?
                ORDER BY lowest_price IS NULL, lowest_price
                LIMIT ?
                """,
                (rs, n) -> new MedicineSummary(
                        rs.getLong("id"), rs.getString("name"), rs.getString("slug"),
                        rs.getString("active_ingredient"), rs.getString("atc_code"),
                        rs.getString("manufacturer"), rs.getString("prescription_status"),
                        rs.getBigDecimal("lowest_price"), rs.getInt("price_count")),
                medicineId, medicineId, limit <= 0 ? 10 : limit);
    }

    /**
     * Checks a medicine against a member's recorded allergies.
     *
     * Every active allergy is considered, not only those typed as DRUG: people
     * record "penicillin" without picking a category, and treating an
     * uncategorised entry as irrelevant would drop exactly the ones that matter.
     */
    /**
     * Slugs for the sitemap, one page at a time.
     *
     * Over ten thousand drug pages, and none of them are discoverable today.
     * A sitemap file may hold fifty thousand URLs, but the response still has
     * to be a sane size, so the caller pages through and writes a sitemap
     * index.
     *
     * Ordered by id, not by name: the order has to stay stable across the pages
     * of one crawl, and a name can change under the monthly sync.
     */
    @Transactional(readOnly = true)
    public List<SitemapEntry> sitemapEntries(int page, int size) {
        int limit = Math.min(Math.max(size, 1), 20000);
        int offset = Math.max(page, 0) * limit;

        return jdbcTemplate.query("""
                SELECT slug, updated_at
                FROM medicine
                ORDER BY id
                LIMIT ? OFFSET ?
                """,
                (rs, rowNum) -> new SitemapEntry(
                        rs.getString("slug"),
                        rs.getTimestamp("updated_at") == null
                                ? null
                                : rs.getTimestamp("updated_at").toLocalDateTime().toLocalDate()),
                limit, offset);
    }

    /** How many pages the sitemap index needs. */
    @Transactional(readOnly = true)
    public long count() {
        Long total = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM medicine", Long.class);
        return total == null ? 0 : total;
    }

    @Transactional(readOnly = true)
    public List<AllergyWarning> checkAllergies(Long memberId, Long userId, Long medicineId) {
        List<Allergy> allergies = records.allergies(memberId, userId).stream()
                .filter(Allergy::isActive).toList();
        if (allergies.isEmpty()) return List.of();

        List<Map<String, Object>> ingredients = jdbcTemplate.queryForList("""
                SELECT mi.normalised, m.id AS medicine_id, m.name
                FROM medicine_ingredient mi JOIN medicine m ON m.id = mi.medicine_id
                WHERE mi.medicine_id = ?
                """, medicineId);

        List<AllergyWarning> warnings = new ArrayList<>();
        java.util.Set<String> seen = new java.util.HashSet<>();

        for (Map<String, Object> row : ingredients) {
            String normalised = (String) row.get("normalised");
            for (Allergy allergy : allergies) {
                if (normaliser.matches(allergy.getAllergen(), normalised)
                        && seen.add(allergy.getAllergen() + "|" + normalised)) {
                    warnings.add(new AllergyWarning(
                            ((Number) row.get("medicine_id")).longValue(),
                            (String) row.get("name"),
                            normalised, allergy.getAllergen(),
                            allergy.getSeverity(), allergy.isCritical(), "INGREDIENT"));
                }
            }
        }

        // Class match. "Penicillin" and "amoxicillin" share no substring, so
        // without this a penicillin allergy would never warn on the catalogue's
        // 96 penicillin-class products.
        Map<String, Object> medicine = jdbcTemplate.queryForMap(
                "SELECT id, name, atc_code FROM medicine WHERE id = ?", medicineId);
        String atc = (String) medicine.get("atc_code");

        if (atc != null && !atc.isBlank()) {
            for (Allergy allergy : allergies) {
                for (String prefix : drugClasses.atcPrefixesFor(allergy.getAllergen())) {
                    // The registry stores several codes per product, separated
                    // by semicolons.
                    boolean hit = java.util.Arrays.stream(atc.split("[;,]"))
                            .map(String::trim)
                            .anyMatch(code -> code.startsWith(prefix));
                    if (hit && seen.add(allergy.getAllergen() + "|atc:" + prefix)) {
                        warnings.add(new AllergyWarning(
                                ((Number) medicine.get("id")).longValue(),
                                (String) medicine.get("name"),
                                prefix, allergy.getAllergen(),
                                allergy.getSeverity(), allergy.isCritical(), "CLASS"));
                    }
                }
            }
        }
        // A life-threatening match must be first in any list a person reads.
        warnings.sort((a, b) -> Boolean.compare(b.critical(), a.critical()));
        return warnings;
    }
}
