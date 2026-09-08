const { spawnSync } = require("node:child_process");
for (const test of [
  "browser-smoke.cjs",
  "navigation-browser.cjs",
  "website-parity-browser.cjs",
  "native-pages-browser.cjs",
  "chat-attachments-browser.cjs",
]) {
  const result = spawnSync(process.execPath, [`tests/${test}`], {
    stdio: "inherit",
    env: process.env,
  });
  if (result.status !== 0) process.exit(result.status || 1);
}
