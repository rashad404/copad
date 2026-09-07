package com.drcopad.copad.config;

import lombok.extern.slf4j.Slf4j;
import org.flywaydb.core.Flyway;
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Repairs the migration history before migrating.
 *
 * Production carries a failed entry for V5 from 2025-06-15. Flyway refuses to
 * run at all while a failure is recorded, and the response at the time was to
 * set flyway.enabled: false, which left the schema unversioned and managed by
 * hibernate ddl-auto instead.
 *
 * repair() is Flyway's supported remedy: it removes failed entries and realigns
 * checksums, without touching application tables. It is safe to run on every
 * start - on a healthy history it does nothing.
 */
@Slf4j
@Configuration
public class FlywayConfig {

    @Bean
    public FlywayMigrationStrategy repairBeforeMigrate() {
        return (Flyway flyway) -> {
            try {
                flyway.repair();
            } catch (Exception e) {
                // A repair failure must not stop the application from starting;
                // migrate() below will surface anything that genuinely blocks.
                log.warn("Flyway repair skipped: {}", e.getMessage());
            }
            flyway.migrate();
        };
    }
}
