export type HealthProvider = "APPLE_HEALTH" | "HEALTH_CONNECT" | "FILE";
export const syncTypes = [
  "WEIGHT",
  "HEIGHT",
  "BLOOD_PRESSURE_SYSTOLIC",
  "BLOOD_PRESSURE_DIASTOLIC",
  "PULSE",
  "RESPIRATORY_RATE",
  "TEMPERATURE",
  "BLOOD_GLUCOSE",
  "OXYGEN_SATURATION",
  "WAIST_CIRCUMFERENCE",
  "HEAD_CIRCUMFERENCE",
] as const;
export type SyncType = (typeof syncTypes)[number];
export interface HealthConnection {
  id: number;
  provider: HealthProvider;
  deviceLabel: string | null;
  enabled: boolean;
  syncedThrough: string | null;
  lastSyncAt: string | null;
}
export interface DeviceSample {
  type: SyncType;
  value: number;
  unit: string;
  measuredAt: string;
  sourceRef: string;
  deviceLabel?: string;
}
export interface SyncCounts {
  accepted: number;
  alreadyHad: number;
  skippedManual: number;
  rejected: number;
}
export interface SyncResponse extends SyncCounts {
  syncedThrough: string | null;
  maxBatch: number;
}
export interface SyncOutcome extends SyncCounts {
  notSent: number;
  finishedAt: string;
  complete: boolean;
  error?: string;
}
export interface PermissionResult {
  requested: boolean;
  limited: boolean;
}
export interface DeviceHealth {
  provider: HealthProvider | null;
  available: () => Promise<boolean>;
  request: () => Promise<PermissionResult>;
  read: (
    from: Date,
    to: Date,
    signal: AbortSignal,
  ) => Promise<{ samples: DeviceSample[]; notSent: number }>;
  settings: () => Promise<void>;
}
export const emptyCounts = (): SyncCounts => ({
  accepted: 0,
  alreadyHad: 0,
  skippedManual: 0,
  rejected: 0,
});
// Device instants are serialized as UTC. Offset-free cursors round-trip the
// UTC LocalDateTime returned by this endpoint, never the phone's local zone.
export function syncInstant(value: string): Date {
  return new Date(/[zZ]|[+-]\d{2}:\d{2}$/.test(value) ? value : `${value}Z`);
}
export function validSample(sample: DeviceSample, now: Date): boolean {
  return (
    syncTypes.includes(sample.type) &&
    Number.isFinite(sample.value) &&
    !!sample.unit &&
    !!sample.sourceRef?.trim() &&
    sample.sourceRef.length <= 255 &&
    Number.isFinite(syncInstant(sample.measuredAt).getTime()) &&
    syncInstant(sample.measuredAt) <= now
  );
}
export const firstSyncDate = (now: Date) =>
  new Date(now.getTime() - 30 * 86400000);
export function canSyncBinding(
  bindingMember: number,
  accountMemberIds: number[],
  writable: boolean,
  self: boolean,
) {
  return writable && self && accountMemberIds.includes(bindingMember);
}
