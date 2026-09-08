import {
  emptyCounts,
  firstSyncDate,
  syncInstant,
  validSample,
  type DeviceHealth,
  type DeviceSample,
  type SyncOutcome,
  type SyncResponse,
} from "./model";
export class InterruptedSync extends Error {
  constructor(
    public readonly outcome: SyncOutcome,
    public readonly cause: unknown,
  ) {
    super("Health sync interrupted");
  }
}
export async function syncReadings(options: {
  source: DeviceHealth;
  cursor: string | null;
  signal: AbortSignal;
  now?: Date;
  send: (samples: DeviceSample[]) => Promise<SyncResponse>;
  onProgress?: (counts: SyncOutcome) => void | Promise<void>;
}): Promise<SyncOutcome> {
  const now = options.now || new Date();
  const totals: SyncOutcome = {
    ...emptyCounts(),
    notSent: 0,
    finishedAt: now.toISOString(),
    complete: false,
  };
  const initial = options.cursor
    ? syncInstant(options.cursor)
    : firstSyncDate(now);
  if (!Number.isFinite(initial.getTime()) || initial > now)
    throw new InterruptedSync(totals, Error("INVALID_SYNC_CURSOR"));
  const check = () => {
    if (options.signal.aborted) throw Error("SYNC_CANCELLED");
  };
  let maxBatch = 500;
  try {
    // Read every permitted type for a day before posting anything from that day.
    // Posting one type's recent samples first would advance the shared cursor
    // past older samples of another type if the next request failed.
    for (let from = initial; from <= now;) {
      check();
      const to = new Date(Math.min(now.getTime(), from.getTime() + 86400000));
      const page = await options.source.read(from, to, options.signal);
      check();
      totals.notSent += page.notSent;
      const samples = page.samples
        .filter((sample) => {
          const valid = validSample(sample, now);
          if (!valid) {
            totals.notSent++;
            return false;
          }
          return (
            syncInstant(sample.measuredAt) >= from &&
            syncInstant(sample.measuredAt) <= to
          );
        })
        .sort(
          (a, b) =>
            syncInstant(a.measuredAt).getTime() -
              syncInstant(b.measuredAt).getTime() ||
            a.sourceRef.localeCompare(b.sourceRef),
        );
      // Native record IDs stay unchanged. The server distinguishes measurements
      // by sourceRef + type + measuredAt, including compound Health Connect records.
      for (let offset = 0; offset < samples.length;) {
        check();
        const batch = samples.slice(offset, offset + maxBatch);
        const response = await options.send(batch);
        check();
        const keys = [
          "accepted",
          "alreadyHad",
          "skippedManual",
          "rejected",
        ] as const;
        if (
          keys.some(
            (key) => !Number.isInteger(response[key]) || response[key] < 0,
          ) ||
          keys.reduce((sum, key) => sum + response[key], 0) !== batch.length
        )
          throw Error("INVALID_SYNC_RESPONSE");
        for (const key of keys) totals[key] += response[key];
        offset += batch.length;
        if (Number.isInteger(response.maxBatch) && response.maxBatch > 0)
          maxBatch = Math.min(500, response.maxBatch);
        await options.onProgress?.({ ...totals });
      }
      if (to.getTime() === now.getTime()) break;
      // Inclusive boundary: an idempotent duplicate is safer than dropping a
      // reading that falls exactly at a day boundary or a resumed cursor.
      from = to;
    }
    totals.finishedAt = new Date().toISOString();
    totals.complete = true;
    return totals;
  } catch (error) {
    totals.finishedAt = new Date().toISOString();
    throw new InterruptedSync(totals, error);
  }
}
