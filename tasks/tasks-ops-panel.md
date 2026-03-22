## Relevant Files

- `web/public/ops/index.html` – Entry point for the internal ops panel.
- `web/src/ops/app.js` – Main logic and routing for the ops panel.
- `web/src/ops/auth.js` – Firebase Auth logic (login, session management).
- `web/src/ops/api.js` – Firebase Firestore interactions for bot records.
- `web/src/ops/components/Login.js` – UI for admin login.
- `web/src/ops/components/FleetList.js` – UI for viewing and searching the bot fleet.
- `web/src/ops/components/BotForm.js` – UI for creating/editing a bot record.
- `firebase.json` – Update hosting rules to route `/ops` to `ops/index.html`.
- `firestore.rules` – Security rules to lock down the `bots` collection.

### Notes

- Using vanilla HTML/JS to match the public `/start` flow.
- Requires Firebase Auth (Email/Password) for admin access.
- Requires Firestore for the `bots` collection.
- No tests required for V1.

## Tasks

- [x] 1.0 Ops Panel Setup & Routing
  - [x] 1.1 Create `web/public/ops/index.html` and `web/src/ops/app.js`.
  - [x] 1.2 Update `firebase.json` to route `/ops` to `ops/index.html`.
  - [x] 1.3 Set up basic state machine in `ops/app.js` (Login -> FleetList -> BotForm).
- [x] 2.0 Implement Firebase Auth & Security Rules
  - [x] 2.1 Initialize Firebase SDK in `web/src/ops/auth.js`.
  - [x] 2.2 Create `Login.js` UI with email/password login.
  - [x] 2.3 Implement login handler and session persistence.
  - [x] 2.4 Create `firestore.rules` allowing read/write to `bots` only for authenticated users.
  - [x] 2.5 Deploy or configure local emulator for Firestore rules.
- [ ] 3.0 Implement Fleet List View & Search
  - [ ] 3.1 Create `FleetList.js` UI with a table/list showing MAC, setup code, kid name, status, last seen.
  - [ ] 3.2 Implement `getBots()` in `ops/api.js` to fetch records from Firestore.
  - [ ] 3.3 Add search/filter inputs (by setup code, MAC, status) to `FleetList.js` and implement local filtering.
  - [ ] 3.4 Add "Create Bot" button that transitions to the Bot Form view.
- [ ] 4.0 Implement Bot Creation & Editing
  - [ ] 4.1 Create `BotForm.js` UI with fields: MAC address, setup code, notes, status dropdown.
  - [ ] 4.2 Implement `createBot()` in `ops/api.js` to save a new record to Firestore.
  - [ ] 4.3 Implement `updateBot()` in `ops/api.js` to modify an existing record.
  - [ ] 4.4 Wire up form submission to save/update and return to the Fleet List view.
- [ ] 5.0 Connect Public `/start` Flow to Firestore
  - [ ] 5.1 Update `web/src/api.js` (public flow) to use actual Firebase Functions or Firestore directly (if using client SDK) to validate codes against the `bots` collection.
  - [ ] 5.2 Update `submitSetup` in `web/src/api.js` to actually update the Firestore record (set `kidName`, `status: claimed`, `claimedAt`).