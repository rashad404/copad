// Website copy is the source of truth. Commit snapshots so native builds stand alone.
const fs = require("node:fs");
const path = require("node:path");
const source = path.resolve(__dirname, "../../next-frontend/src");
const target = path.resolve(__dirname, "../src/copy/website");
fs.mkdirSync(target, { recursive: true });
const files = {
  "medicines.json": "translations/medicines.json",
  "az.json": "translations/az.json",
  "en.json": "translations/en.json",
  "ru.json": "translations/ru.json",
  "home.json": "components/home/translations.json",
  "labs.json": "components/labs/translations.json",
};
for (const [name, file] of Object.entries(files)) {
  fs.writeFileSync(
    path.join(target, name),
    fs.readFileSync(path.join(source, file)),
  );
}
for (const [name, file] of Object.entries({
  "auth.ts": "components/auth/copy.ts",
  "doctors.ts": "components/doctors/copy.ts",
  "portal.ts": "components/booking/portalCopy.ts",
})) {
  fs.writeFileSync(
    path.join(target, name),
    fs
      .readFileSync(path.join(source, file), "utf8")
      .replace("@/components/doctors/copy", "./doctors"),
  );
}
