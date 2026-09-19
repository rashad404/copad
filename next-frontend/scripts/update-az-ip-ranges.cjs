/**
 * Regenerates src/utils/geo/azRanges.json from DB-IP's free country database.
 *
 * Only Azerbaijani ranges are kept: the site needs to answer one question -
 * is this visitor in Azerbaijan? - and a few hundred ranges answer it without
 * shipping a 60 MB database or a native reader.
 *
 * Run monthly, or whenever a visitor in Baku reports seeing English:
 *   node scripts/update-az-ip-ranges.cjs
 *
 * Data: DB-IP IP to Country Lite, CC BY 4.0 (https://db-ip.com).
 */
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const month = (offset) => {
  const d = new Date();
  d.setUTCMonth(d.getUTCMonth() - offset);
  return d.toISOString().slice(0, 7);
};

async function download() {
  // The file for this month appears a day or two in; last month's still works.
  for (const offset of [0, 1]) {
    const url = `https://download.db-ip.com/free/dbip-country-lite-${month(offset)}.csv.gz`;
    const res = await fetch(url);
    if (res.ok) return { url, body: Buffer.from(await res.arrayBuffer()) };
  }
  throw new Error("DB-IP country file not available for this month or last");
}

(async () => {
  const { url, body } = await download();
  const rows = zlib.gunzipSync(body).toString("utf8").split("\n");
  const v4 = [];
  const v6 = [];
  for (const row of rows) {
    const [start, end, country] = row.trim().split(",");
    if (country !== "AZ") continue;
    (start.includes(":") ? v6 : v4).push([start, end]);
  }
  if (v4.length < 100) {
    // A handful of ranges means the format changed, not that Azerbaijan
    // shrank. Refuse rather than ship a list that sends Baku to English.
    throw new Error(`Only ${v4.length} IPv4 ranges found; refusing to write`);
  }
  const out = path.join(__dirname, "../src/utils/geo/azRanges.json");
  fs.writeFileSync(
    out,
    JSON.stringify({ source: url, license: "CC BY 4.0, db-ip.com", v4, v6 }) +
      "\n",
  );
  console.log(`Wrote ${v4.length} IPv4 and ${v6.length} IPv6 ranges to ${out}`);
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
