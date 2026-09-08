#!/bin/zsh
set -euo pipefail
cd "${0:A:h}/.."
: "${APPLE_TEAM_ID:?Set APPLE_TEAM_ID to your local Apple development team}"
export DEVELOPER_DIR="${DEVELOPER_DIR:-/Applications/Xcode.app/Contents/Developer}"
export AZDOC_BUILD_VARIANT=preview
export EXPO_PUBLIC_API_URL="${EXPO_PUBLIC_API_URL:-http://100.89.150.50:8002/api}"
export ENTRY_FILE=index.ts
export NODE_ENV=production
export CI=1
export EXPO_NO_TELEMETRY=1
npx expo prebuild --platform ios --no-install
(cd ios && pod install)
mkdir -p native-builds
xcodebuild \
  -workspace ios/azdocPreview.xcworkspace \
  -scheme azdocPreview \
  -configuration Release \
  -destination 'generic/platform=iOS' \
  -derivedDataPath native-builds/derived \
  -allowProvisioningUpdates \
  DEVELOPMENT_TEAM="$APPLE_TEAM_ID" \
  CODE_SIGN_STYLE=Automatic \
  CODE_SIGN_IDENTITY='Apple Development' \
  build
printf '%s\n' "Native app: $PWD/native-builds/derived/Build/Products/Release-iphoneos/azdocPreview.app"
