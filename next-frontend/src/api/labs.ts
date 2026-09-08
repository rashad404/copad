import api from "./axios";
import type { SiteLanguage } from "@/utils/languages";
import type { LabTest, LabOrder, OrderRequest } from "@/components/labs/model";
export const labApi = {
  tests: (
    slug: string,
    q: string,
    language: SiteLanguage,
    signal?: AbortSignal,
  ) =>
    api
      .get<LabTest[]>(`/labs/${encodeURIComponent(slug)}/tests`, {
        params: { q, lang: language },
        signal,
      })
      .then((r) => r.data),
  orders: (memberId: number, signal?: AbortSignal) =>
    api
      .get<LabOrder[]>(`/members/${memberId}/lab-orders`, { signal })
      .then((r) => r.data),
  create: (memberId: number, body: OrderRequest) =>
    api
      .post<LabOrder>(`/members/${memberId}/lab-orders`, body)
      .then((r) => r.data),
  cancel: (memberId: number, id: number) =>
    api
      .post<LabOrder>(`/members/${memberId}/lab-orders/${id}/cancel`, {})
      .then((r) => r.data),
};
