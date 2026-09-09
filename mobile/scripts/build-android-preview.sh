#!/bin/zsh
set -euo pipefail
cd "${0:A:h:h}"
export AZDOC_BUILD_VARIANT=preview
export EXPO_PUBLIC_API_URL=${EXPO_PUBLIC_API_URL:-http://100.89.150.50:8002/api}
export ENTRY_FILE=index.ts
export NODE_ENV=production
export CI=1
export EXPO_NO_TELEMETRY=1
export ANDROID_HOME=${ANDROID_HOME:-$HOME/Library/Android/sdk}
if [[ -z "${JAVA_HOME:-}" && -d /opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home ]]; then
  export JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home
fi
npx expo prebuild --platform android --no-install
cd android
./gradlew generateCodegenArtifactsFromSchema --max-workers=2
./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a --max-workers=2
