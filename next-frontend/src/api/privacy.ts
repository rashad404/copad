import api from "./axios";
import { readableError } from "@/components/health/model";
import { isAxiosError } from "axios";
export type ConsentType = "RECORD_STORAGE" | "CROSS_BORDER_AI" | "GUARDIAN";
export interface ConsentGrant {
  type: ConsentType;
  familyMemberId: number | null;
  policyVersion: string;
  grantedAt: string | null;
  withdrawnAt: string | null;
  active: boolean;
}
export interface Consents {
  policyVersion: string;
  consents: ConsentGrant[];
}
export interface DeletionResult {
  deleted: boolean;
  removed: Record<string, number>;
}
export const privacyApi = {
  consents: (signal?: AbortSignal) =>
    api.get<Consents>("/account/consent", { signal }).then((r) => r.data),
  grant: (type: ConsentType, familyMemberId?: number) =>
    api
      .post<Consents>("/account/consent", {
        type,
        ...(familyMemberId == null ? {} : { familyMemberId }),
      })
      .then((r) => r.data),
  withdraw: (type: ConsentType, familyMemberId?: number) =>
    api
      .delete<Consents>(`/account/consent/${type}`, {
        params: familyMemberId == null ? undefined : { familyMemberId },
      })
      .then((r) => r.data),
  export: (id: number, signal?: AbortSignal) =>
    api
      .get<Blob>(`/members/${id}/export.zip`, { responseType: "blob", signal })
      .then((r) => r.data),
  deleteMember: (id: number) =>
    api.delete<DeletionResult>(`/members/${id}/data`).then((r) => r.data),
  deleteAccount: (password: string) =>
    api
      .delete<DeletionResult>("/account", { data: { password } })
      .then((r) => r.data),
};
/** Refusals first. Never POST a consent that was not selected. */
export async function saveRegistrationConsents(storage: boolean, ai: boolean) {
  for (const [type, accepted] of [
    ["CROSS_BORDER_AI", ai],
    ["RECORD_STORAGE", storage],
  ] as const) {
    const result = accepted
      ? await privacyApi.grant(type)
      : await privacyApi.withdraw(type);
    const rows = result.consents.filter((row) => row.type === type);
    if (
      accepted
        ? !rows.some((row) => row.active)
        : rows.some((row) => row.active) || !rows.some((row) => row.withdrawnAt)
    ) {
      throw new Error("Consent choice was not recorded");
    }
  }
}
export async function privacyError(error: unknown, fallback: string) {
  if (isAxiosError(error) && error.response?.data instanceof Blob) {
    const text = await error.response.data.text();
    try {
      const data: unknown = JSON.parse(text);
      if (data && typeof data === "object") {
        for (const key of ["message", "detail", "error"]) {
          const value = (data as Record<string, unknown>)[key];
          if (typeof value === "string" && value.trim()) return value;
        }
      }
    } catch {
      if (
        text.trim() &&
        !text.trim().startsWith("<") &&
        error.response.data.type.startsWith("text/plain")
      )
        return text;
    }
    return fallback;
  }
  return readableError(error, fallback);
}
