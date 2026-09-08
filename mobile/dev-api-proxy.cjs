const http = require("node:http");
const https = require("node:https");
/** A frontend-only development bridge. Native requests go straight to the API. */
function createApiBridge(target = "http://100.89.150.50:8002/api") {
  const base = new URL(target);
  if (!["http:", "https:"].includes(base.protocol))
    throw Error("Invalid development API URL");
  return (request, response, next) => {
    if (!request.url.startsWith("/dev-api/")) return next();
    const url = new URL(base);
    const requested = new URL(request.url, "http://preview.invalid");
    url.pathname =
      base.pathname.replace(/\/$/, "") +
      requested.pathname.slice("/dev-api".length);
    url.search = requested.search;
    const headers = {};
    for (const key of [
      "authorization",
      "content-type",
      "content-length",
      "accept",
      "x-guest-session-id",
    ]) {
      if (request.headers[key]) headers[key] = request.headers[key];
    }
    const transport = url.protocol === "https:" ? https : http;
    const upstream = transport.request(
      url,
      { method: request.method, headers },
      (result) => {
        response.statusCode = result.statusCode || 502;
        for (const key of [
          "content-type",
          "content-disposition",
          "www-authenticate",
          "x-urgent",
          "x-urgent-categories",
          "x-emergency-number",
          "x-request-id",
          "retry-after",
        ]) {
          if (result.headers[key]) response.setHeader(key, result.headers[key]);
        }
        response.setHeader("cache-control", "no-store");
        result.pipe(response);
      },
    );
    upstream.setTimeout(120000, () =>
      upstream.destroy(new Error("API timeout")),
    );
    upstream.on("error", () => {
      if (!response.headersSent) {
        response.statusCode = 502;
        response.setHeader("content-type", "application/json");
        response.end(
          JSON.stringify({ message: "The development API is unavailable." }),
        );
      } else response.destroy();
    });
    request.on("aborted", () => upstream.destroy());
    response.on("close", () => {
      if (!response.writableEnded) upstream.destroy();
    });
    request.pipe(upstream);
  };
}
module.exports = { createApiBridge };
