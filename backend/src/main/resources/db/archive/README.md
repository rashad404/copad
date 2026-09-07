# Archived migrations

`V5`-`V7` are kept for reference but are no longer on Flyway's classpath.

They were never applied successfully in production. `V5` failed there on
2025-06-15 (`flyway_schema_history.success = 0`), and rather than repairing it
someone set `flyway.enabled: false`, so `V6` and `V7` never ran either. The
schema they describe was instead created by `hibernate ddl-auto: update`, which
is why production and development already match column for column.

Leaving them on the classpath would make Flyway try to re-apply changes the
schema already has, which is what failed in the first place. They are archived
rather than deleted so the intended DDL remains readable.

New migrations continue from `V8`.
