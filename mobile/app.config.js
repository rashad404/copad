const { withAndroidManifest } = require("expo/config-plugins");

module.exports = ({ config }) => {
  const preview = process.env.AZDOC_BUILD_VARIANT === "preview";
  return {
    ...config,
    name: preview ? "azdoc Preview" : "azdoc",
    locales: {
      az: "./locales/az.json",
      en: "./locales/en.json",
      ru: "./locales/ru.json",
    },
    scheme: preview ? "azdoc-preview" : "azdoc",
    ios: {
      ...config.ios,
      bundleIdentifier: preview ? "ai.azdoc.app.preview" : "ai.azdoc.app",
      infoPlist: {
        ...config.ios?.infoPlist,
        CFBundleDevelopmentRegion: "az",
        CFBundleLocalizations: ["az", "en", "ru"],
        ...(preview
          ? { NSAppTransportSecurity: { NSAllowsArbitraryLoads: true } }
          : {}),
      },
    },
    android: {
      ...config.android,
      permissions: [
        "WEIGHT",
        "HEIGHT",
        "BLOOD_PRESSURE",
        "HEART_RATE",
        "RESPIRATORY_RATE",
        "BODY_TEMPERATURE",
        "BLOOD_GLUCOSE",
        "OXYGEN_SATURATION",
      ].map((type) => `android.permission.health.READ_${type}`),
      package: preview ? "ai.azdoc.app.preview" : "ai.azdoc.app",
    },
    plugins: [
      ...(config.plugins || []),
      "./plugins/with-fmt-compat",
      [
        "@kingstinct/react-native-healthkit",
        {
          NSHealthShareUsageDescription:
            require("./locales/az.json").ios.NSHealthShareUsageDescription,
          NSHealthUpdateUsageDescription: false,
          background: false,
        },
      ],
      "./plugins/with-health-permissions",
      "./plugins/with-android-health-build",
      [
        "expo-build-properties",
        {
          android: {
            minSdkVersion: 26,
            compileSdkVersion: 36,
            targetSdkVersion: 36,
          },
        },
      ],
      (nativeConfig) =>
        withAndroidManifest(nativeConfig, (result) => {
          const application = result.modResults.manifest.application?.[0];
          if (application)
            application.$["android:usesCleartextTraffic"] = preview
              ? "true"
              : "false";
          return result;
        }),
    ],
  };
};
