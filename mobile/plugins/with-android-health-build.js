const {
  withProjectBuildGradle,
  withGradleProperties,
} = require("expo/config-plugins");
// Health Connect 1.1.0 requires AGP >=8.9.1. AGP 8.10.1 supports API 36
// and works with the SDK 53 project's Gradle 8.13 wrapper and JDK 17+.
module.exports = (config) => {
  config = withGradleProperties(config, (c) => {
    c.modResults = c.modResults.filter(
      (p) => p.type !== "property" || p.key !== "org.gradle.jvmargs",
    );
    c.modResults.push({
      type: "property",
      key: "org.gradle.jvmargs",
      value: "-Xmx4096m -XX:MaxMetaspaceSize=1536m",
    });
    return c;
  });
  return withProjectBuildGradle(config, (c) => {
    if (c.modResults.language !== "groovy")
      throw Error("Expected the Expo Groovy root build file");
    const pattern =
      /classpath\(['"]com\.android\.tools\.build:gradle(?::[^'"]+)?['"]\)/;
    if (!pattern.test(c.modResults.contents))
      throw Error("Android Gradle plugin declaration not found");
    c.modResults.contents = c.modResults.contents.replace(
      pattern,
      "classpath('com.android.tools.build:gradle:8.10.1')",
    );
    return c;
  });
};
