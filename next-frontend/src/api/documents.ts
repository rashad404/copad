import api from "./axios";
import type { AbnormalFlag } from "./healthRecord";
export type DocumentType =
  | "LAB_RESULT"
  | "IMAGING"
  | "PRESCRIPTION"
  | "DISCHARGE_SUMMARY"
  | "REFERRAL"
  | "VACCINATION"
  | "INSURANCE"
  | "OTHER";
export interface MemberDocument {
  id: number;
  title: string | null;
  documentType: DocumentType;
  documentDate: string | null;
  provider: string | null;
  contentType: string | null;
  sizeBytes: number | null;
  extractionStatus:
    "PENDING" | "PROCESSING" | "COMPLETED" | "SKIPPED" | "FAILED";
  extractionError?: string | null;
  hasText: boolean;
  notes: string | null;
  createdAt: string;
}
export interface LabResult {
  source: "EXTRACTED" | "MANUAL";
  referenceLow: number | null;
  referenceHigh: number | null;
  id: number;
  documentId: number | null;
  analyte: string;
  analyteKey: string;
  value: number | null;
  valueText: string | null;
  unit: string | null;
  displayValue: string | null;
  referenceLabel: string | null;
  abnormalFlag: AbnormalFlag | null;
  abnormal: boolean;
  collectedAt: string | null;
  confirmed: boolean;
}
export interface ProposedMedication {
  id: number;
  sourceDocumentId: number | null;
  name: string | null;
  doseAmount: number | null;
  doseUnit: string | null;
  doseLabel: string | null;
  frequency: string | null;
  route: string | null;
  startedOn: string | null;
  endedOn: string | null;
  prescriber: string | null;
  confirmed: boolean;
}
export interface ManualLabInput {
  analyte: string;
  value: number | null;
  valueText: string | null;
  unit: string | null;
  referenceLow: number | null;
  referenceHigh: number | null;
  referenceLabel: string | null;
  collectedAt: string | null;
}
export type LabCorrections = Partial<
  Pick<LabResult, "value" | "unit" | "analyte" | "collectedAt">
>;
export type MedicationCorrections = Partial<
  Pick<
    ProposedMedication,
    | "name"
    | "doseAmount"
    | "doseUnit"
    | "frequency"
    | "route"
    | "startedOn"
    | "endedOn"
  >
>;
const base = (member: number) => `/members/${member}/documents`;
export const documentsApi = {
  list: (member: number, signal?: AbortSignal) =>
    api.get<MemberDocument[]>(base(member), { signal }).then((r) => r.data),
  upload: (
    member: number,
    body: FormData,
    signal?: AbortSignal,
    onProgress?: (percent: number) => void,
  ) =>
    api
      .post<MemberDocument>(base(member), body, {
        signal,
        onUploadProgress: (e) => {
          if (e.total) onProgress?.(Math.round((e.loaded / e.total) * 100));
        },
      })
      .then((r) => r.data),
  content: (member: number, id: number, signal?: AbortSignal) =>
    api
      .get<Blob>(`${base(member)}/${id}/content`, {
        responseType: "blob",
        signal,
      })
      .then((r) => r.data),
  remove: (member: number, id: number, signal?: AbortSignal) =>
    api.delete(`${base(member)}/${id}`, { signal }),
  labs: (member: number, signal?: AbortSignal) =>
    api
      .get<LabResult[]>(`${base(member)}/lab-results`, { signal })
      .then((r) => r.data),
  createLab: (member: number, body: ManualLabInput, signal?: AbortSignal) =>
    api
      .post<LabResult>(`${base(member)}/lab-results`, body, { signal })
      .then((r) => r.data),
  pendingLabs: (member: number, signal?: AbortSignal) =>
    api
      .get<LabResult[]>(`${base(member)}/lab-results/pending`, { signal })
      .then((r) => r.data),
  series: (member: number, analyte: string, signal?: AbortSignal) =>
    api
      .get<LabResult[]>(
        `${base(member)}/lab-results/series/${encodeURIComponent(analyte)}`,
        { signal },
      )
      .then((r) => r.data),
  confirmLab: (
    member: number,
    id: number,
    body: LabCorrections,
    signal?: AbortSignal,
  ) =>
    api
      .post<LabResult>(`${base(member)}/lab-results/${id}/confirm`, body, {
        signal,
      })
      .then((r) => r.data),
  rejectLab: (member: number, id: number, signal?: AbortSignal) =>
    api.delete(`${base(member)}/lab-results/${id}`, { signal }),
  pendingMedications: (member: number, signal?: AbortSignal) =>
    api
      .get<ProposedMedication[]>(`${base(member)}/medications/pending`, {
        signal,
      })
      .then((r) => r.data),
  confirmMedication: (
    member: number,
    id: number,
    body: MedicationCorrections,
    signal?: AbortSignal,
  ) =>
    api
      .post<ProposedMedication>(
        `${base(member)}/medications/${id}/confirm`,
        body,
        { signal },
      )
      .then((r) => r.data),
  rejectMedication: (member: number, id: number, signal?: AbortSignal) =>
    api.delete(`${base(member)}/medications/${id}`, { signal }),
};
