import type { HealthConnectRecordResult } from "react-native-health-connect";
import type { DeviceSample, SyncType } from "./model";
export const healthConnectTypes = [
  "Weight",
  "Height",
  "BloodPressure",
  "HeartRate",
  "RespiratoryRate",
  "BodyTemperature",
  "BloodGlucose",
  "OxygenSaturation",
] as const;
export type HealthConnectType = (typeof healthConnectTypes)[number];
export type NativeHealthRecord = Extract<
  HealthConnectRecordResult,
  { recordType: HealthConnectType }
>;
export function healthConnectSamples(
  record: NativeHealthRecord,
): DeviceSample[] {
  const sourceRef = record.metadata?.id || "";
  const deviceLabel =
    [record.metadata?.device?.manufacturer, record.metadata?.device?.model]
      .filter(Boolean)
      .join(" ") ||
    record.metadata?.dataOrigin ||
    "Health Connect";
  const sample = (
    type: SyncType,
    value: number,
    unit: string,
    measuredAt: string,
  ): DeviceSample => ({
    type,
    value,
    unit,
    measuredAt,
    sourceRef,
    deviceLabel,
  });
  switch (record.recordType) {
    case "Weight":
      return [sample("WEIGHT", record.weight.inKilograms, "kg", record.time)];
    case "Height":
      return [
        sample("HEIGHT", record.height.inMeters * 100, "cm", record.time),
      ];
    case "BloodPressure":
      return [
        sample(
          "BLOOD_PRESSURE_SYSTOLIC",
          record.systolic.inMillimetersOfMercury,
          "mmHg",
          record.time,
        ),
        sample(
          "BLOOD_PRESSURE_DIASTOLIC",
          record.diastolic.inMillimetersOfMercury,
          "mmHg",
          record.time,
        ),
      ];
    case "HeartRate":
      return record.samples.map((s) =>
        sample("PULSE", s.beatsPerMinute, "bpm", s.time),
      );
    case "RespiratoryRate":
      return [sample("RESPIRATORY_RATE", record.rate, "bpm", record.time)];
    case "BodyTemperature":
      return [
        sample("TEMPERATURE", record.temperature.inCelsius, "C", record.time),
      ];
    case "BloodGlucose":
      return [
        sample(
          "BLOOD_GLUCOSE",
          record.level.inMillimolesPerLiter,
          "mmol/L",
          record.time,
        ),
      ];
    case "OxygenSaturation":
      return [sample("OXYGEN_SATURATION", record.percentage, "%", record.time)];
  }
}
