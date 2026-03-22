## Relevant Files

- `web/public/index.html` – Main entry point for the web app.
- `web/src/app.js` – Main application logic (agnostic framework placeholder).
- `web/src/api.js` – Functions to interact with the backend API.
- `web/src/components/SetupForm.js` – UI component for entering the setup code.
- `web/src/components/NameForm.js` – UI component for entering the kid's name.
- `web/src/components/Confirmation.js` – UI component for the success screen.
- `firebase.json` – Firebase hosting configuration to map `/start` to the app.

### Notes

- We are using a stack-agnostic approach for now, focusing on the product flow.
- The app will be hosted on Firebase Hosting at `mojbot-5000.web.app/start` (Firebase Project ID: `mojbot-5000`).
- No tests are required for V1.

## Tasks

- [x] 1.0 Project Setup & Routing
  - [x] 1.1 Initialize basic web project structure (web/public, web/src)
  - [x] 1.2 Configure firebase.json so /start routes to the app
  - [x] 1.3 Set up basic app state/routing flow: Setup Code → Kid Name → Confirmation
- [x] 2.0 Implement Setup Code Entry
  - [x] 2.1 Create SetupForm.js with: heading, short explanation, setup code input, continue button
  - [x] 2.2 Implement form submission handler to capture the setup code
  - [x] 2.3 Validate setup code input client-side (required, trimmed, normalized)
  - [x] 2.4 Integrate api.js with POST /api/validate-code
  - [x] 2.5 Show loading state while validating
  - [x] 2.6 On invalid code, show plain-language inline error and allow retry
  - [x] 2.7 On success, preserve validated setup code in app state and transition to Kid Name step
- [x] 3.0 Implement Kid Name Entry
  - [x] 3.1 Create NameForm.js with: heading, short explanation, kid name input, finish/setup button
  - [x] 3.2 Implement form submission handler to capture the kid name
  - [x] 3.3 Validate kid name client-side (required, trimmed, max 30 chars)
  - [x] 3.4 Preserve setup code + kid name in app state for final submission
- [x] 4.0 Implement Backend Integration
  - [x] 4.1 Implement POST /api/start in api.js sending: setup_code, kid_name
  - [x] 4.2 Show loading state while saving
  - [x] 4.3 Disable submit button while request is in progress
  - [x] 4.4 On failure, show plain-language error and allow retry without losing entered values
  - [x] 4.5 On success, transition to Confirmation screen
- [x] 5.0 Implement Confirmation Screen
  - [x] 5.1 Create Confirmation.js with: success headline, short "saving/syncing" message, optional helper line about restarting the robot if needed
  - [x] 5.2 Use final v1 copy that clearly explains what happens next
- [ ] 6.0 Finalize V1 Copy
  - [ ] 6.1 Finalize setup code screen copy
  - [ ] 6.2 Finalize invalid code error copy
  - [ ] 6.3 Finalize kid name screen copy
  - [ ] 6.4 Finalize save failure copy
  - [ ] 6.5 Finalize confirmation screen copy
- [ ] 7.0 Backend Ownership Clarification
  - [ ] 7.1 Confirm whether this team also owns Firebase Functions/backend endpoints
  - [ ] 7.2 If yes, implement: POST /api/validate-code, POST /api/start
  - [ ] 7.3 If no, stub against agreed API contract and do not invent a different backend shape
- [ ] 8.0 Manual Verification
  - [ ] 8.1 Verify valid code → kid name → confirmation flow
  - [ ] 8.2 Verify invalid code error flow
  - [ ] 8.3 Verify save failure flow
  - [ ] 8.4 Verify refresh/retry behavior is not obviously broken

---

## Required V1 Copy Direction

**Setup code screen**
Set up your MojBot
Enter the code that came with your robot to get started.

**Invalid code error**
That code wasn’t found. Check the code and try again.

**Kid name screen**
Name your MojBot
Enter your kid’s name so MojBot can personalize the experience.

**Confirmation screen**
You’re all set
MojBot is saving your setup now. If your robot is online, it should update shortly.

*Optional helper line:*
If needed, restart your robot to pull the latest settings.

---

## V1 Non-Goals

Do not add:
- dashboards
- accounts/login
- AI/chat features
- advanced robot settings
- lesson browsers
- multi-step profile management
- fancy animations if they slow down shipping

This site has one job:
setup code → kid name → save → confirm