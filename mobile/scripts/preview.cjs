const fs = require("node:fs");
const path = require("node:path");
const { execFileSync, spawn } = require("node:child_process");
const root = fs.realpathSync(path.join(__dirname, ".."));
function listening() {
  try {
    return execFileSync("lsof", ["-t", "-iTCP:3003", "-sTCP:LISTEN"], {
      encoding: "utf8",
    })
      .trim()
      .split(/\s+/)
      .filter(Boolean);
  } catch {
    return [];
  }
}
(async () => {
  for (const pid of listening()) {
    const lines = execFileSync("lsof", ["-a", "-p", pid, "-d", "cwd", "-Fn"], {
      encoding: "utf8",
    }).split("\n");
    const directory = lines.find((line) => line.startsWith("n"))?.slice(1);
    if (!directory || fs.realpathSync(directory) !== root)
      throw Error(
        "Port 3003 belongs to a different checkout. Stop that verified Codex preview before starting this one.",
      );
    process.kill(Number(pid), "SIGTERM");
  }
  for (let i = 0; i < 20 && listening().length; i++)
    await new Promise((resolve) => setTimeout(resolve, 250));
  if (listening().length) throw Error("Port 3003 is still occupied");
  fs.mkdirSync(path.join(root, ".expo"), { recursive: true });
  const log = fs.openSync(path.join(root, ".expo", "preview.log"), "a");
  const child = spawn(
    process.execPath,
    [
      require.resolve("expo/bin/cli"),
      "start",
      "--port",
      "3003",
      "--host",
      "lan",
    ],
    {
      cwd: root,
      env: {
        ...process.env,
        CI: "1",
        EXPO_OFFLINE: "1",
        EXPO_NO_TELEMETRY: "1",
      },
      detached: true,
      stdio: ["ignore", log, log],
    },
  );
  child.unref();
  fs.closeSync(log);
  console.log(`Mobile preview: http://100.89.150.50:3003 (PID ${child.pid})`);
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
