import api from "../core/api";
import type {
  HealthConnection,
  HealthProvider,
  DeviceSample,
  SyncResponse,
} from "../health/model";
export const healthSyncApi = {
  list: (memberId: number, signal?: AbortSignal) =>
    api
      .get<HealthConnection[]>(`/members/${memberId}/health-sync`, { signal })
      .then((r) => r.data),
  connect: (
    memberId: number,
    provider: HealthProvider,
    deviceLabel: string,
    token?: string,
  ) =>
    api
      .post(
        `/members/${memberId}/health-sync/connect`,
        { provider, deviceLabel },
        { ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}) },
      )
      .then((r) => r.data),
  disconnect: (memberId: number, provider: HealthProvider) =>
    api
      .post(`/members/${memberId}/health-sync/disconnect`, { provider })
      .then((r) => r.data),
  send: (
    memberId: number,
    provider: HealthProvider,
    samples: DeviceSample[],
    signal?: AbortSignal,
    token?: string,
  ) =>
    api
      .post<SyncResponse>(
        `/members/${memberId}/health-sync`,
        { provider, samples },
        {
          signal,
          ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
        },
      )
      .then((r) => r.data),
};
