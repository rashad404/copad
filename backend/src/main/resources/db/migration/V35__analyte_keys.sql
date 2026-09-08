-- Say when two laboratories are pricing the same thing.
--
-- The catalogue held 1,551 tests and could compare almost none of them: the two
-- laboratories name things differently, so only tests spelled identically lined
-- up. analyte_key has been on the table since V28 for exactly this and was
-- never filled in.
--
-- Curated, not fuzzy-matched. A general matcher pairs a blood glucose with a
-- urine glucose, and it paired "Lipid spektri (HDL, VLDL, LDL, xolesterin,
-- trigliseridler)" with a single LDL test - 51 manat against 14, which is not a
-- price difference but a different product. A pattern is accepted only where it
-- identifies exactly one test at a laboratory, panels are excluded, and
-- anything ambiguous is left unmapped. Nineteen analytes are now priced at both
-- and can be compared honestly; a confident wrong answer would be worse than a
-- smaller right one.

UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'hba1c' WHERE l.slug = 'saglam-aile' AND t.code = 'SA-1175';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'hba1c' WHERE l.slug = 'referans' AND t.code = 'LAB-04-091';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'cholesterol-total' WHERE l.slug = 'saglam-aile' AND t.code = 'SA-1200';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'hdl' WHERE l.slug = 'saglam-aile' AND t.code = 'SA-1202';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'hdl' WHERE l.slug = 'referans' AND t.code = 'LAB-04-116';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'ldl' WHERE l.slug = 'referans' AND t.code = 'LAB-04-118';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'triglycerides' WHERE l.slug = 'saglam-aile' AND t.code = 'SA-1201';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'triglycerides' WHERE l.slug = 'referans' AND t.code = 'LAB-04-110';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'urea' WHERE l.slug = 'referans' AND t.code = 'LAB-04-101';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'uric-acid' WHERE l.slug = 'referans' AND t.code = 'LAB-04-102';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'alt' WHERE l.slug = 'saglam-aile' AND t.code = 'SA-1217';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'alt' WHERE l.slug = 'referans' AND t.code = 'LAB-04-003';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'ast' WHERE l.slug = 'saglam-aile' AND t.code = 'SA-1218';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'ast' WHERE l.slug = 'referans' AND t.code = 'LAB-04-018';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'alp' WHERE l.slug = 'saglam-aile' AND t.code = 'SA-1209';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'bilirubin-total' WHERE l.slug = 'saglam-aile' AND t.code = 'SA-1195';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'bilirubin-total' WHERE l.slug = 'referans' AND t.code = 'LAB-04-124';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'amylase' WHERE l.slug = 'referans' AND t.code = 'LAB-04-010';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'lipase' WHERE l.slug = 'saglam-aile' AND t.code = 'SA-1212';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'lipase' WHERE l.slug = 'referans' AND t.code = 'LAB-04-060';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'albumin' WHERE l.slug = 'saglam-aile' AND t.code = 'SA-1186';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'albumin' WHERE l.slug = 'referans' AND t.code = 'LAB-04-004';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'total-protein' WHERE l.slug = 'referans' AND t.code = 'LAB-04-125';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'globulin' WHERE l.slug = 'saglam-aile' AND t.code = 'SA-1187';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'globulin' WHERE l.slug = 'referans' AND t.code = 'LAB-04-090';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'esr' WHERE l.slug = 'saglam-aile' AND t.code = 'SA-1143';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'esr' WHERE l.slug = 'referans' AND t.code = 'LAB-01-002';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'ferritin' WHERE l.slug = 'saglam-aile' AND t.code = 'SA-1252';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'ferritin' WHERE l.slug = 'referans' AND t.code = 'LAB-04-040';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'iron' WHERE l.slug = 'saglam-aile' AND t.code = 'SA-1234';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 't4-free' WHERE l.slug = 'saglam-aile' AND t.code = 'SA-1301';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 't4-free' WHERE l.slug = 'referans' AND t.code = 'LAB-10-061';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 't3-free' WHERE l.slug = 'saglam-aile' AND t.code = 'SA-1300';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 't3-free' WHERE l.slug = 'referans' AND t.code = 'LAB-10-060';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'vitamin-d' WHERE l.slug = 'saglam-aile' AND t.code = 'SA-1236';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'vitamin-d' WHERE l.slug = 'referans' AND t.code = 'LAB-08-008';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'vitamin-b12' WHERE l.slug = 'saglam-aile' AND t.code = 'SA-1248';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'vitamin-b12' WHERE l.slug = 'referans' AND t.code = 'LAB-08-003';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'folate' WHERE l.slug = 'saglam-aile' AND t.code = 'SA-1247';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'psa-total' WHERE l.slug = 'referans' AND t.code = 'LAB-10-052';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'prolactin' WHERE l.slug = 'saglam-aile' AND t.code = 'SA-1312';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'prolactin' WHERE l.slug = 'referans' AND t.code = 'LAB-10-051';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'insulin' WHERE l.slug = 'saglam-aile' AND t.code = 'SA-6003';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'magnesium' WHERE l.slug = 'saglam-aile' AND t.code = 'SA-5498';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'magnesium' WHERE l.slug = 'referans' AND t.code = 'LAB-04-064';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'calcium-total' WHERE l.slug = 'saglam-aile' AND t.code = 'SA-5602';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'phosphorus' WHERE l.slug = 'saglam-aile' AND t.code = 'SA-1229';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'potassium' WHERE l.slug = 'saglam-aile' AND t.code = 'SA-1224';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'sodium' WHERE l.slug = 'saglam-aile' AND t.code = 'SA-1225';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'd-dimer' WHERE l.slug = 'saglam-aile' AND t.code = 'SA-1159';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'd-dimer' WHERE l.slug = 'referans' AND t.code = 'LAB-02-008';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'fibrinogen' WHERE l.slug = 'saglam-aile' AND t.code = 'SA-1161';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'fibrinogen' WHERE l.slug = 'referans' AND t.code = 'LAB-02-020';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'inr' WHERE l.slug = 'saglam-aile' AND t.code = 'SA-1157';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'aptt' WHERE l.slug = 'saglam-aile' AND t.code = 'SA-1158';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'hepatitis-c-anti' WHERE l.slug = 'referans' AND t.code = 'LAB-09-016';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'hiv' WHERE l.slug = 'referans' AND t.code = 'LAB-09-059';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'beta-hcg' WHERE l.slug = 'referans' AND t.code = 'LAB-10-021';
UPDATE lab_test t JOIN lab l ON l.id = t.lab_id SET t.analyte_key = 'amh' WHERE l.slug = 'saglam-aile' AND t.code = 'SA-1324';
