const { withAndroidManifest } = require("expo/config-plugins");

module.exports = ({ config }) => {
  const preview = process.env.AZDOC_BUILD_VARIANT === "preview";
  return {
    ...config,
    name: preview ? "azdoc Preview" : "azdoc",
    scheme: preview ? "azdoc-preview" : "azdoc",
    ios: {
      ...config.ios,
      bundleIdentifier: preview ? "ai.azdoc.app.preview" : "ai.azdoc.app",
      infoPlist: {
        ...config.ios?.infoPlist,
        ...(preview
          ? { NSAppTransportSecurity: { NSAllowsArbitraryLoads: true } }
          : {}),
      },
    },
    android: {
      ...config.android,
      package: preview ? "ai.azdoc.app.preview" : "ai.azdoc.app",
    },
    plugins: [
      ...(config.plugins || []),
      "./plugins/with-fmt-compat",
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
