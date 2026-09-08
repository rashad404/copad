# Mobile environments

Development uses the existing backend at `http://100.89.150.50:8002/api`. The mobile preview is always on port 3003. Port 3002 belongs to the main website preview.

Native development requests go directly to port 8002. In the browser, Metro's `/dev-api` middleware forwards to that backend because the backend's CORS allowlist does not include port 3003. The bridge preserves auth, upload bodies and emergency/download response headers. It has a fixed upstream and does not log health data. It is development-only.

Set `EXPO_PUBLIC_API_URL` in `.env.local` to override the API base. Include `/api`, without a trailing slash. Values prefixed `EXPO_PUBLIC_` are included in the bundle, so never put secrets there. Restart Expo after changing environment configuration.

`eas.json` defines a preview environment using port 8002 and production using `https://azdoc.ai/api`. Release builds also default to the production HTTPS API when no override is provided. The browser bridge is not used in release exports.

For a physical device, connect it to the same Tailscale network. If a native OS blocks the development HTTP endpoint, use an HTTPS preview backend or an approved development-client transport exception. Do not weaken production transport security.

`npm run dev` starts a detached preview and records its output in `.expo/preview.log`. It only stops a port-3003 process whose working directory is this mobile checkout. To switch from another Codex branch, first verify and stop that branch's preview. Do not allocate another port or stop the main agent's server.
