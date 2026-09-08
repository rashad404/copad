import api from "../core/api";
export interface MedicineSummary {
  id: number;
  name: string;
  slug: string;
  activeIngredient: string | null;
  manufacturer: string | null;
  prescriptionStatus: string | null;
  lowestPrice: number | null;
  priceCount: number;
}
export interface PriceOption {
  tradeName: string;
  dosage: string | null;
  form: string | null;
  packaging: string | null;
  manufacturer: string | null;
  retailPrice: number | null;
}
export interface MedicineDetail {
  id: number;
  name: string;
  slug: string;
  active_ingredient: string | null;
  manufacturer: string | null;
  prescription_status: string | null;
  release_form: string | null;
  description_az: string | null;
  prices: PriceOption[];
  alternatives: MedicineSummary[];
}
export interface AllergyWarning {
  medicineName: string;
  allergen: string;
  severity: string;
  critical: boolean;
  basis: "INGREDIENT" | "CLASS";
}
export const checkMedicineAllergies = (
  id: number,
  memberId: number,
  signal?: AbortSignal,
) =>
  api
    .get<AllergyWarning[]>(`/medicines/${id}/allergy-check`, {
      params: { memberId },
      signal,
    })
    .then((r) => r.data);
