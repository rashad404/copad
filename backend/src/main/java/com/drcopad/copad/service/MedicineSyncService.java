package com.drcopad.copad.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.Set;

/**
 * Copies the drug catalogue from bugun.az into azdoc.
 *
 * A direct database read rather than an HTTP API: both databases are ours and
 * sit on the same host, the data changes monthly, and a network hop between two
 * of our own products would add a failure mode to a lookup that runs while
 * someone is mid-conversation about their medication.
 *
 * The sync is idempotent and matched on the source id, so re-running updates
 * rather than duplicating. It is disabled unless a source URL is configured,
 * which keeps development and any environment without access to bugun.az from
 * failing on startup.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MedicineSyncService {

    private final JdbcTemplate jdbcTemplate;
    private final IngredientNormaliser normaliser;

    @Value("${medicine.sync.url:}")
    private String sourceUrl;

    @Value("${medicine.sync.username:}")
    private String sourceUsername;

    @Value("${medicine.sync.password:}")
    private String sourcePassword;

    public record SyncResult(int medicines, int ingredients, int prices, String message) {
    }

    public boolean isConfigured() {
        return sourceUrl != null && !sourceUrl.isBlank();
    }

    /**
     * Monthly, matching how often the registry publishes. Early on a Sunday so
     * a long-running copy does not compete with daytime traffic.
     */
    @Scheduled(cron = "0 0 4 1 * *")
    public void scheduledSync() {
        if (!isConfigured()) {
            log.debug("Medicine sync skipped: no source configured");
            return;
        }
        try {
            SyncResult result = sync();
            log.info("Medicine sync complete: {}", result.message());
        } catch (Exception e) {
            // A failed sync leaves the previous catalogue in place, which is
            // stale but usable; it must not take the application down.
            log.error("Medicine sync failed: {}", e.getMessage());
        }
    }

    @Transactional
    public SyncResult sync() throws SQLException {
        if (!isConfigured()) {
            return new SyncResult(0, 0, 0, "No source configured");
        }

        int medicines = 0;
        int ingredients = 0;
        int prices = 0;
        LocalDateTime now = LocalDateTime.now();

        try (Connection source = DriverManager.getConnection(sourceUrl, sourceUsername, sourcePassword)) {
            try (PreparedStatement ps = source.prepareStatement("""
                    SELECT id, name, slug, active_ingredient, atc_code, manufacturer,
                           release_form, prescription_status, medicine_type,
                           registration_number, registration_date, expiry_date,
                           description_az, usage_az, side_effects_az,
                           contraindications_az, interactions_az, storage_az
                    FROM medicines
                    """);
                 ResultSet rs = ps.executeQuery()) {

                while (rs.next()) {
                    Long sourceId = rs.getLong("id");
                    String slug = rs.getString("slug");

                    jdbcTemplate.update("""
                            INSERT INTO medicine (source_id, name, slug, active_ingredient, atc_code,
                                manufacturer, release_form, prescription_status, medicine_type,
                                registration_number, registration_date, expiry_date,
                                description_az, usage_az, side_effects_az, contraindications_az,
                                interactions_az, storage_az, synced_at)
                            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                            ON DUPLICATE KEY UPDATE
                                source_id = VALUES(source_id), name = VALUES(name),
                                active_ingredient = VALUES(active_ingredient), atc_code = VALUES(atc_code),
                                manufacturer = VALUES(manufacturer), release_form = VALUES(release_form),
                                prescription_status = VALUES(prescription_status),
                                medicine_type = VALUES(medicine_type),
                                registration_number = VALUES(registration_number),
                                registration_date = VALUES(registration_date),
                                expiry_date = VALUES(expiry_date),
                                description_az = VALUES(description_az), usage_az = VALUES(usage_az),
                                side_effects_az = VALUES(side_effects_az),
                                contraindications_az = VALUES(contraindications_az),
                                interactions_az = VALUES(interactions_az), storage_az = VALUES(storage_az),
                                synced_at = VALUES(synced_at)
                            """,
                            sourceId, rs.getString("name"), slug, rs.getString("active_ingredient"),
                            rs.getString("atc_code"), rs.getString("manufacturer"),
                            rs.getString("release_form"), rs.getString("prescription_status"),
                            rs.getString("medicine_type"), rs.getString("registration_number"),
                            rs.getDate("registration_date"), rs.getDate("expiry_date"),
                            rs.getString("description_az"), rs.getString("usage_az"),
                            rs.getString("side_effects_az"), rs.getString("contraindications_az"),
                            rs.getString("interactions_az"), rs.getString("storage_az"), now);
                    medicines++;

                    Long medicineId = jdbcTemplate.queryForObject(
                            "SELECT id FROM medicine WHERE slug = ?", Long.class, slug);

                    // Rebuilt rather than merged: the parser improves over time,
                    // and stale rows from an older version would linger.
                    jdbcTemplate.update("DELETE FROM medicine_ingredient WHERE medicine_id = ?", medicineId);

                    Set<String> parsed = normaliser.parse(rs.getString("active_ingredient"));
                    for (String ingredient : parsed) {
                        jdbcTemplate.update(
                                "INSERT INTO medicine_ingredient (medicine_id, normalised, raw) VALUES (?,?,?)",
                                medicineId, ingredient,
                                abbreviate(rs.getString("active_ingredient")));
                        ingredients++;
                    }
                }
            }

            jdbcTemplate.update("DELETE FROM medicine_price");
            try (PreparedStatement ps = source.prepareStatement("""
                    SELECT id, medicine_id, trade_name, active_ingredient, dosage, form,
                           packaging, pack_quantity, manufacturer, wholesale_price,
                           retail_price, effective_date
                    FROM medicine_prices
                    """);
                 ResultSet rs = ps.executeQuery()) {

                while (rs.next()) {
                    Long sourceMedicineId = rs.getObject("medicine_id") == null
                            ? null : rs.getLong("medicine_id");
                    Long localMedicineId = sourceMedicineId == null ? null
                            : jdbcTemplate.query("SELECT id FROM medicine WHERE source_id = ?",
                                    r -> r.next() ? r.getLong(1) : null, sourceMedicineId);

                    jdbcTemplate.update("""
                            INSERT INTO medicine_price (medicine_id, source_id, trade_name,
                                active_ingredient, dosage, form, packaging, pack_quantity,
                                manufacturer, wholesale_price, retail_price, effective_date, synced_at)
                            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
                            """,
                            localMedicineId, rs.getLong("id"), rs.getString("trade_name"),
                            abbreviate(rs.getString("active_ingredient")), rs.getString("dosage"),
                            rs.getString("form"), rs.getString("packaging"),
                            rs.getString("pack_quantity"), abbreviate(rs.getString("manufacturer")),
                            rs.getBigDecimal("wholesale_price"), rs.getBigDecimal("retail_price"),
                            rs.getString("effective_date"), now);
                    prices++;
                }
            }
        }

        String message = String.format("%d medicines, %d ingredients, %d prices",
                medicines, ingredients, prices);
        return new SyncResult(medicines, ingredients, prices, message);
    }

    /** Source columns are TEXT; ours are bounded, so long values are trimmed. */
    private String abbreviate(String value) {
        if (value == null) return null;
        return value.length() <= 512 ? value : value.substring(0, 512);
    }
}
