import api from "./axios";
export type FamilyRole = "OWNER" | "ADULT" | "VIEWER";
export interface Member {
  id: number;
  familyId: number;
  fullName: string;
  relationship: string;
  dateOfBirth: string | null;
  biologicalSex: string | null;
  bloodType: string | null;
  avatarUrl: string | null;
  birthWeightGrams: number | null;
  birthLengthCm: number | null;
  gestationalAgeWeeks: number | null;
  ageYears: number | null;
  ageMonths: number | null;
  correctedAgeMonths: number | null;
  minor: boolean;
  self: boolean;
}
export interface Family {
  id: number;
  name: string;
  role: FamilyRole;
  members: Member[];
}
export type RecordKind =
  | "conditions"
  | "allergies"
  | "medications"
  | "immunizations";
export type RecordValue = string | number | boolean | null;
export interface ClinicalEntry {
  id: number;
  [key: string]: RecordValue;
}
export interface Revision {
  id: number;
  recordType: string;
  recordId: number;
  action: string;
  changedByName: string | null;
  snapshot: string;
  createdAt: string;
}
export type VitalType =
  | "WEIGHT"
  | "HEIGHT"
  | "BMI"
  | "BLOOD_PRESSURE_SYSTOLIC"
  | "BLOOD_PRESSURE_DIASTOLIC"
  | "PULSE"
  | "RESPIRATORY_RATE"
  | "TEMPERATURE"
  | "BLOOD_GLUCOSE"
  | "OXYGEN_SATURATION"
  | "WAIST_CIRCUMFERENCE"
  | "HEAD_CIRCUMFERENCE";
export type AbnormalFlag =
  | "NORMAL"
  | "LOW"
  | "HIGH"
  | "CRITICAL_LOW"
  | "CRITICAL_HIGH";
export interface VitalReading {
  id: number;
  vitalType: VitalType;
  value: number;
  unit: string;
  valueEntered: number | null;
  unitEntered: string | null;
  measuredAt: string;
  abnormalFlag: AbnormalFlag | null;
  abnormal: boolean;
  notes: string | null;
}
export interface Trend {
  type: VitalType;
  direction: "RISING" | "FALLING" | "STABLE";
  changePercent: number;
  changeAbsolute: number;
  readings: number;
  first: number;
  last: number;
  unit: string;
}
export interface VitalInput {
  vitalType: VitalType;
  value: number;
  unit?: string;
  measuredAt?: string;
  notes?: string;
}
export const healthApi = {
  families: (signal?: AbortSignal) =>
    api.get<Family[]>("/families", { signal }).then((r) => r.data),
  addMember: (familyId: number, body: Record<string, RecordValue>) =>
    api.post<Member>(`/families/${familyId}/members`, body).then((r) => r.data),
  updateMember: (id: number, body: Record<string, RecordValue>) =>
    api.put<Member>(`/families/members/${id}`, body).then((r) => r.data),
  deleteMember: (id: number) => api.delete(`/families/members/${id}`),
  list: (id: number, kind: RecordKind, signal?: AbortSignal) =>
    api
      .get<ClinicalEntry[]>(`/members/${id}/${kind}`, { signal })
      .then((r) => r.data),
  save: (
    id: number,
    kind: RecordKind,
    body: Record<string, RecordValue>,
    recordId?: number,
  ) =>
    (recordId === undefined
      ? api.post<ClinicalEntry>(`/members/${id}/${kind}`, body)
      : api.put<ClinicalEntry>(`/members/${id}/${kind}/${recordId}`, body)
    ).then((r) => r.data),
  remove: (id: number, kind: RecordKind, recordId: number) =>
    api.delete(`/members/${id}/${kind}/${recordId}`),
  latest: (id: number, signal?: AbortSignal) =>
    api
      .get<
        Partial<Record<VitalType, VitalReading>>
      >(`/members/${id}/vitals/latest`, { signal })
      .then((r) => r.data),
  series: (id: number, type: VitalType, signal?: AbortSignal) =>
    api
      .get<VitalReading[]>(`/members/${id}/vitals/series/${type}`, { signal })
      .then((r) => r.data),
  trends: (id: number, windowDays: number, signal?: AbortSignal) =>
    api
      .get<
        Trend[]
      >(`/members/${id}/vitals/trends`, { params: { windowDays }, signal })
      .then((r) => r.data),
  addVital: (id: number, body: VitalInput) =>
    api.post<VitalReading>(`/members/${id}/vitals`, body).then((r) => r.data),
  history: (id: number, signal?: AbortSignal) =>
    api
      .get<Revision[]>(`/members/${id}/history`, { signal })
      .then((r) => r.data),
};
