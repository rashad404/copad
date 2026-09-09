import {
  initialize,
  getSdkStatus,
  SdkAvailabilityStatus,
  requestPermission,
  getGrantedPermissions,
  readRecords,
  openHealthConnectSettings,
} from "react-native-health-connect";
import type { DeviceHealth, DeviceSample } from "./model";
import {
  healthConnectSamples,
  healthConnectTypes,
  type NativeHealthRecord,
} from "./healthConnectModel";
async function available() {
  return (
    (await getSdkStatus()) === SdkAvailabilityStatus.SDK_AVAILABLE &&
    (await initialize())
  );
}
const deviceHealth: DeviceHealth = {
  provider: "HEALTH_CONNECT",
  available,
  request: async () => {
    if (!(await available())) throw Error("HEALTH_UNAVAILABLE");
    const permissions = await requestPermission(
      healthConnectTypes.map((recordType) => ({
        accessType: "read",
        recordType,
      })),
    );
    const granted = healthConnectTypes.filter((type) =>
      permissions.some(
        (p) =>
          "recordType" in p && p.recordType === type && p.accessType === "read",
      ),
    );
    return {
      requested: granted.length > 0,
      limited: granted.length < healthConnectTypes.length,
    };
  },
  read: async (from, to, signal) => {
    if (!(await available())) throw Error("HEALTH_UNAVAILABLE");
    const permissions = await getGrantedPermissions();
    const granted = healthConnectTypes.filter((type) =>
      permissions.some(
        (p) =>
          "recordType" in p && p.recordType === type && p.accessType === "read",
      ),
    );
    if (!granted.length) throw Error("HEALTH_PERMISSION_DENIED");
    const samples: DeviceSample[] = [];
    for (const type of granted) {
      let pageToken: string | undefined;
      const seen = new Set<string>();
      while (true) {
        if (signal.aborted) throw Error("SYNC_CANCELLED");
        const page = await readRecords(type, {
          timeRangeFilter: {
            operator: "between",
            startTime: from.toISOString(),
            endTime: to.toISOString(),
          },
          pageSize: 500,
          pageToken,
          ascendingOrder: true,
        });
        for (const record of page.records) {
          samples.push(
            ...healthConnectSamples({
              ...record,
              recordType: type,
            } as NativeHealthRecord),
          );
        }
        if (!page.pageToken) break;
        if (seen.has(page.pageToken)) throw Error("HEALTH_PAGING_ERROR");
        seen.add(page.pageToken);
        pageToken = page.pageToken;
      }
    }
    return { samples, notSent: 0 };
  },
  settings: async () => {
    openHealthConnectSettings();
  },
};
export default deviceHealth;
