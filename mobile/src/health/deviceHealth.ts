import type { DeviceHealth } from "./model";
// Browser preview cannot read a phone's HealthKit or Health Connect store.
const unavailable = async () => {
  throw Error("HEALTH_UNAVAILABLE");
};
const deviceHealth: DeviceHealth = {
  provider: null,
  available: async () => false,
  request: unavailable,
  read: unavailable,
  settings: unavailable,
};
export default deviceHealth;
