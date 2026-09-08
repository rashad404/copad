const { getDefaultConfig } = require("expo/metro-config");
const { createApiBridge } = require("./dev-api-proxy.cjs");
const config = getDefaultConfig(__dirname);
const bridge = createApiBridge(
  process.env.EXPO_PUBLIC_API_URL || "http://100.89.150.50:8002/api",
);
const existing = config.server.enhanceMiddleware;
config.server.enhanceMiddleware = (middleware, server) => {
  const enhanced = existing ? existing(middleware, server) : middleware;
  return (req, res, next) => bridge(req, res, () => enhanced(req, res, next));
};
module.exports = config;
