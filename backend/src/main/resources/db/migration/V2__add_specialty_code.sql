-- Add code column
ALTER TABLE medical_specialties ADD COLUMN code VARCHAR(50) UNIQUE;

-- Update existing specialties with their codes
UPDATE medical_specialties SET code = 'general' WHERE name = 'General Practitioner';
UPDATE medical_specialties SET code = 'ent' WHERE name = 'ENT Specialist';
UPDATE medical_specialties SET code = 'cardio' WHERE name = 'Cardiologist';
UPDATE medical_specialties SET code = 'neuro' WHERE name = 'Neurologist';
UPDATE medical_specialties SET code = 'ortho' WHERE name = 'Orthopedist';
UPDATE medical_specialties SET code = 'pediatric' WHERE name = 'Pediatrician';
UPDATE medical_specialties SET code = 'derma' WHERE name = 'Dermatologist';
UPDATE medical_specialties SET code = 'psych' WHERE name = 'Psychiatrist';
UPDATE medical_specialties SET code = 'gyno' WHERE name = 'Gynecologist';
UPDATE medical_specialties SET code = 'ophth' WHERE name = 'Ophthalmologist';

-- Make code column not nullable after updating existing records
ALTER TABLE medical_specialties MODIFY code VARCHAR(50) NOT NULL; 