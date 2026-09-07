/**
 * Upload categories the backend accepts for medical documents.
 * Kept in one place so the <select> values and the API contract cannot drift.
 */
export type MedicalFileCategory =
  | 'general'
  | 'lab-results'
  | 'imaging'
  | 'prescriptions'
  | 'clinical-notes';
