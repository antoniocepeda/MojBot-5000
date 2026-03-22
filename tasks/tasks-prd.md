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
- The app will be hosted on Firebase Hosting at `mojbot-5000.web.app/start`.
- No tests are required for V1.

## Tasks

- [x] 1.0 Project Setup & Routing
  - [x] 1.1 Initialize basic web project structure (`web/public`, `web/src`).
  - [x] 1.2 Configure `firebase.json` to route `/start` to the main web app entry point.
  - [x] 1.3 Set up basic routing logic in `app.js` to handle the flow (Setup -> Name -> Confirmation).
- [ ] 2.0 Implement Setup Code Entry (Step 1 & 2)
  - [ ] 2.1 Create `SetupForm.js` UI with heading, explanation, code input field, and continue button.
  - [ ] 2.2 Implement form submission handler to capture the setup code.
  - [ ] 2.3 Integrate with `api.js` to call validation endpoint to validate the code.
  - [ ] 2.4 Handle validation failure by showing a plain-language error message and allowing retry.
  - [ ] 2.5 On success, transition the app state to the Kid Name Entry step.
- [ ] 3.0 Implement Kid Name Entry (Step 3)
  - [ ] 3.1 Create `NameForm.js` UI with heading, explanation, name input field, and submit button.
  - [ ] 3.2 Implement form submission handler to capture the kid's name.
- [ ] 4.0 Implement Backend API Integration (Step 4)
  - [ ] 4.1 Implement the final `POST /api/start` call in `api.js` sending both `setup_code` and `kid_name`.
  - [ ] 4.2 Handle API loading state (disable submit button, show spinner).
  - [ ] 4.3 Handle API failure (show error, allow retry).
  - [ ] 4.4 On API success, transition the app state to the Confirmation Screen.
- [ ] 5.0 Implement Confirmation Screen (Step 5)
  - [ ] 5.1 Create `Confirmation.js` UI showing success message and "robot is ready / syncing" message.
  - [ ] 5.2 Add optional helper line about restarting the robot.