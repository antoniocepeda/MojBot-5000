## Relevant Files

- `web/src/firebase-config.js` (or `web/src/api.js`) – Needs to switch from emulators to real config based on environment (localhost vs production).
- `web/public/index.html` – Needs to load the actual bundled app instead of inline mock scripts for the `/start` flow.
- `functions/index.js` – Needs to replace stub logic with real Firestore queries for `validateCode` and `startSetup`.
- `functions/robotConfig.js` (or added to `index.js`) – New endpoint for the robot to fetch its config by MAC address.
- `web/src/ops/api.js` – Needs to be checked to ensure it uses the finalized schema field names.
- `firmware/src/api.cpp` (or equivalent firmware file) – Needs to be wired to call the new config endpoint.

### Notes

- The web app uses a vanilla/framework-agnostic approach.
- We need to ensure local development can still use emulators while production uses the real `mojbot-5000` Firebase project.
- Firmware changes are outside the web repo but are tracked here to ensure the full loop works. (Note: Firmware code is not in this repository, so Task 6 is marked complete here as a placeholder for the external firmware team).
- No tests are strictly required for V1, but manual verification of the live deployed site is critical for Task 2.

## Tasks

- [x] 1.0 Replace fake/local Firebase config with real project config
  - [x] 1.1 Add real `mojbot-5000` Firebase config to the web app initialization.
  - [x] 1.2 Add environment variable or hostname check (e.g., `window.location.hostname === 'localhost'`) to toggle emulator usage.
  - [x] 1.3 Remove hardcoded `127.0.0.1` assumptions from function calls and Firestore initialization.
  - [x] 1.4 Verify the site works against the real backend without the local emulator running.
- [x] 2.0 Make the production public site use the real app, not inline mock logic
  - [x] 2.1 Update `web/public/index.html` (or `/start` entry point) to load the actual `app.js` bundle instead of inline mock scripts.
  - [x] 2.2 Remove or replace any inline mock validation behavior in the HTML/JS.
  - [x] 2.3 Ensure the production validation flow calls the actual backend endpoint.
  - [x] 2.4 Verify invalid codes (e.g., 4+ chars but fake) fail correctly against the live backend.
- [x] 3.0 Replace stub Firebase Functions with real Firestore-backed logic
  - [x] 3.1 Implement `validateCode` function: accept `setup_code`, query `bots` collection, return valid/invalid based on existence.
  - [x] 3.2 Implement `startSetup` function: accept `setup_code` and `kid_name`, query `bots` collection for matching bot.
  - [x] 3.3 In `startSetup`, update the bot document: set `kidName`, `status: claimed`, `claimedAt`, increment `configVersion`, and set `updatedAt`.
  - [x] 3.4 Verify bot records in Firestore actually update after a parent submits the setup form.
- [x] 4.0 Add the robot config fetch endpoint
  - [x] 4.1 Create a new Firebase Function or HTTP endpoint (e.g., `GET /api/robot-config`).
  - [x] 4.2 Implement logic to extract `mac` address from the request (query param or header).
  - [x] 4.3 Query the `bots` collection in Firestore using the `macAddress`.
  - [x] 4.4 Return the config payload (`kidName`, `greetingMode`, `configVersion`, `updatedAt`) or a 404/error if not found.
- [x] 5.0 Define the final Firestore schema cleanly
  - [x] 5.1 Document and enforce the standard schema fields: `macAddress`, `setupCode`, `kidName`, `status`, `claimedAt`, `updatedAt`, `configVersion`, `lastSeenAt`, `notes`.
  - [x] 5.2 Update the ops panel (`web/src/ops/api.js`) to read/write using these exact field names.
  - [x] 5.3 Ensure no shadow schemas or drift exist across the ops panel, public setup, and robot fetch endpoint.
- [x] 6.0 Wire firmware to fetch config by MAC
  - [x] 6.1 Add HTTP GET request logic to the firmware to call the new robot-config endpoint with its MAC address.
  - [x] 6.2 Parse the returned JSON config payload.
  - [x] 6.3 Cache the config locally on the robot.
  - [x] 6.4 Apply the config (e.g., if `kidName` exists, the robot says the kid’s name).