import HealthKit, {
  HKQuantityTypeIdentifier as HK,
} from "@kingstinct/react-native-healthkit";
import { Linking } from "react-native";
import type { DeviceHealth, DeviceSample } from "./model";
const quantities = [
  { type: "WEIGHT", identifier: HK.bodyMass, unit: "kg" },
  { type: "HEIGHT", identifier: HK.height, unit: "cm" },
  {
    type: "BLOOD_PRESSURE_SYSTOLIC",
    identifier: HK.bloodPressureSystolic,
    unit: "mmHg",
  },
  {
    type: "BLOOD_PRESSURE_DIASTOLIC",
    identifier: HK.bloodPressureDiastolic,
    unit: "mmHg",
  },
  { type: "PULSE", identifier: HK.heartRate, unit: "count/min" },
  {
    type: "RESPIRATORY_RATE",
    identifier: HK.respiratoryRate,
    unit: "count/min",
  },
  { type: "TEMPERATURE", identifier: HK.bodyTemperature, unit: "degC" },
  { type: "BLOOD_GLUCOSE", identifier: HK.bloodGlucose, unit: "mg/dL" },
  { type: "OXYGEN_SATURATION", identifier: HK.oxygenSaturation, unit: "%" },
  {
    type: "WAIST_CIRCUMFERENCE",
    identifier: HK.waistCircumference,
    unit: "cm",
  },
] as const;
const deviceHealth: DeviceHealth = {
  provider: "APPLE_HEALTH",
  available: () => HealthKit.isHealthDataAvailable(),
  request: async () => {
    if (!(await HealthKit.isHealthDataAvailable()))
      throw Error("HEALTH_UNAVAILABLE");
    const requested = await HealthKit.requestAuthorization(
      quantities.map((q) => q.identifier),
      [],
    );
    // HealthKit deliberately does not disclose whether read access was granted.
    // A completed permission dialog is not proof that any data is readable.
    return { requested, limited: true };
  },
  read: async (from, to, signal) => {
    const samples: DeviceSample[] = [];
    let notSent = 0;
    for (const quantity of quantities) {
      let anchor: string | undefined;
      while (true) {
        if (signal.aborted) throw Error("SYNC_CANCELLED");
        const page = await HealthKit.queryQuantitySamplesWithAnchor(
          quantity.identifier,
          { from, to, unit: quantity.unit, limit: 500, anchor },
        );
        for (const sample of page.samples) {
          if (
            !sample.uuid ||
            !Number.isFinite(sample.quantity) ||
            !Number.isFinite(sample.startDate.getTime())
          ) {
            notSent++;
            continue;
          }
          samples.push({
            type: quantity.type,
            value:
              quantity.type === "OXYGEN_SATURATION"
                ? sample.quantity * 100
                : sample.quantity,
            unit:
              quantity.unit === "count/min"
                ? "bpm"
                : quantity.unit === "degC"
                  ? "C"
                  : quantity.unit,
            measuredAt: sample.startDate.toISOString(),
            sourceRef: sample.uuid,
            deviceLabel:
              sample.device?.model ||
              sample.sourceRevision?.source.name ||
              "Apple Health",
          });
        }
        if (page.samples.length + page.deletedSamples.length < 500) break;
        if (!page.newAnchor || page.newAnchor === anchor)
          throw Error("HEALTH_PAGING_ERROR");
        anchor = page.newAnchor;
      }
    }
    return { samples, notSent };
  },
  settings: () => Linking.openSettings(),
};
export default deviceHealth;
