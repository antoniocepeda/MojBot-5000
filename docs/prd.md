# MojBot Website PRD (V1)

## Purpose
Define the smallest useful website experience needed to support MojBot v1 onboarding.

This PRD is intentionally narrow.
The website exists to get a parent from **robot is on Wi‑Fi** to **kid name is saved and the robot can personalize itself**.

It is **not** a dashboard, LMS, social product, or AI playground.

---

## Product context
### Working product definition
**A programmable robot dog sidekick that makes coding real and fun.**

### V1 guardrails
- V1 is **not AI-first**
- Avoid Chinese server dependence
- Dog ships **prebuilt**
- Primary buyer is **parents**
- Target age range is **10–15**
- First wow moment is: **kid enters their name and the robot says it**

### Website job in v1
The website’s job is to create the cleanest possible handoff from Wi‑Fi onboarding into product personalization.

In plain English:
1. parent gets robot online
2. parent goes to `mojbot.com/start`
3. parent enters printed setup code
4. parent enters kid name
5. backend stores config for the correct robot
6. robot fetches config and says the kid’s name

If that works, the spine exists.

---

## Problem statement
Right now the firmware can get the robot onto Wi‑Fi and tell the parent to go to `mojbot.com/start`, but the actual product-side website flow still needs to be defined.

Without a clean website flow:
- the parent has no clear next step after Wi‑Fi
- the robot cannot be linked cleanly to a kid name
- the first wow moment cannot happen reliably

So the website must solve one specific problem:
**take a parent from setup code entry to successful kid-name personalization with as little friction as possible.**

---

## Users
### Primary user
**Parent** setting up the robot for their child.

### Secondary user
**Kid**, but mostly as the beneficiary of personalization, not the primary setup actor.

### Internal/admin user
Tony/dev team, only as needed to seed/manage robot records in the database.

---

## Core v1 user story
> As a parent, after I connect the robot to Wi‑Fi, I want to go to a simple website, enter the printed code, enter my kid’s name, and know the robot is set up correctly.

---

## V1 success criteria
The website is successful if a parent can:
1. land on `mojbot.com/start`
2. enter a valid setup code
3. enter the kid’s name
4. submit successfully
5. see a clear confirmation that setup worked
6. cause the robot to fetch that config and personalize itself

### Functional end state
- correct robot record is identified from the setup code
- kid name is stored in backend config for that robot
- robot can fetch config using its MAC address
- robot can cache and apply config locally
- first personalization loop works end-to-end

---

## Identity model (locked)
### Customer-facing identity
- **Printed setup code**
- Human-friendly
- Included with the robot / on the printed getting-started sheet

### Robot-facing identity
- **ESP MAC address**
- Used by the robot to fetch its config

### Backend role
- Bridge between printed setup code and robot MAC-backed record

### Why this model
- Parent should never need to see or type a MAC address
- Robot already has a stable hardware identity
- Avoids per-device custom firmware identity hacks
- Keeps the parent flow simple and the device flow reliable

---

## V1 scope
### In scope
- public landing route at `mojbot.com/start`
- setup code entry
- code validation
- kid name entry
- saving config to the correct robot record
- confirmation screen after successful submission
- backend API for robot config fetch by MAC address
- minimal config schema for the robot

### Out of scope
- full parent dashboard
- account creation/login unless absolutely necessary
- lesson browser/LMS
- chat UI
- AI assistant features
- advanced robot settings panel
- real-time live sync dashboard
- complex profile management
- multiple kids per robot
- fleet management UI

---

## Desired user experience
### Tone
- simple
- parent-friendly
- calm
- trustworthy
- not technical
- not toy-chaotic

### UX principles
- one obvious next step at a time
- short forms only
- no developer-looking settings
- no unnecessary branching
- copy should reduce uncertainty

### Emotional outcome
Parent should feel:
- “I know what to do.”
- “This worked.”
- “The robot is now my kid’s robot.”

---

## Primary flow
### Entry point
Parent reaches `mojbot.com/start` after the robot tells them to go there.

### Step 1: Enter setup code
Parent sees:
- simple heading
- short explanation
- one code field
- continue button

#### Example copy
**Set up your MojBot**  
Enter the code that came with your robot to get started.

### Step 2: Validate code
System checks whether code exists and maps to a robot record.

#### On success
- move to kid-name step

#### On failure
- show plain-language error
- allow retry

#### Example error copy
That code wasn’t found. Check the code and try again.

### Step 3: Enter kid name
Parent sees:
- name field
- short explanation that robot will use this name
- submit button

#### Example copy
**Name your robot dog**  
Enter your kid’s name so MojBot can personalize the experience.

### Step 4: Save config
Backend stores name on the correct robot record and bumps config version/update timestamp.

### Step 5: Confirmation screen
Parent sees:
- success message
- robot is ready / syncing message
- optionally a note that the robot may need a moment to update

#### Example confirmation copy
**You’re all set**  
MojBot is saving your setup now. If your robot is online, it should update shortly.

Optional helper line:
- If needed, restart the robot or trigger a sync to pull the latest settings.

---

## Backend requirements
### Robot record model
At minimum, each robot record needs:
- `mac_address`
- `setup_code`
- `kid_name`
- `greeting_mode`
- `config_version`
- `updated_at`

Optional later fields:
- `claimed_at`
- `status`
- `eye_mode`
- `last_seen_at`
- `firmware_version`

### Required backend behaviors
1. validate setup code
2. find robot record for that code
3. save kid name and minimal config
4. bump config version / timestamp
5. serve config back to robot by MAC address

---

## API requirements
### 1. Setup submit endpoint
**Purpose:** Save parent-submitted setup data

Suggested shape:
`POST /api/start`

#### Request
```json
{
  "setup_code": "ABCD1234",
  "kid_name": "Maya"
}
```

#### Success response
```json
{
  "ok": true
}
```

#### Failure response
```json
{
  "ok": false,
  "error": "invalid_code"
}
```

### 2. Robot config fetch endpoint
**Purpose:** Let robot fetch config using its MAC address

Suggested shape:
`GET /api/robot-config?mac=1c:db:d4:ee:9e:50`

#### Success response
```json
{
  "ok": true,
  "config": {
    "kid_name": "Maya",
    "greeting_mode": "default",
    "config_version": 3,
    "updated_at": "2026-03-21T23:30:00Z"
  }
}
```

#### Not found / unclaimed response
```json
{
  "ok": true,
  "config": null
}
```

### API design principles
- tiny payloads
- boring JSON
- obvious errors
- no premature abstraction circus

---

## Robot integration requirements
The website PRD depends on a matching robot behavior.

### Robot should:
- know its own MAC address
- fetch config after Wi‑Fi connect and/or on boot
- cache last-known config locally
- keep working if backend is temporarily unavailable
- apply the latest config when a valid response arrives

### Minimum visible robot behavior
If `kid_name` exists:
- robot says the kid’s name using a greeting line

This is the first proof the website actually matters.

---

## Content requirements
### Required fields in v1 UI
- setup code
- kid name

### Optional field only if truly trivial
- greeting mode

### Explicitly not in v1 UI
- Wi‑Fi settings
- OTA settings
- wake word settings
- advanced behavior toggles
- account profile complexity
- lesson editor

---

## Copy guidance
### Avoid
- technical jargon
- device IDs / MAC addresses
- words like provisioning, sync architecture, config schema
- multi-step explanations that feel like manuals

### Prefer
- clear next actions
- short confirmations
- parent language
- product language

---

## Error handling requirements
### Invalid setup code
Show a plain error and allow retry.

### Backend temporarily unavailable
Show a plain “please try again” message.

### Duplicate / reused code behavior
Need a policy decision, but likely one of these:
- allow resubmission and overwrite same robot config
- or reject after claim if v1 wants stronger control

### Recommendation for v1
Allow overwrite for now if it simplifies setup/testing, unless there is a strong business reason not to.

---

## Analytics / observability (minimal)
For v1 we should minimally log:
- setup page visits
- code validation success/failure
- setup submission success/failure
- robot config fetch success/failure
- last seen robot MAC fetch time

This is not for vanity metrics. It is for debugging whether the loop actually works.

---

## Security / abuse notes
V1 should be simple, but not reckless.

### Minimum safety
- setup codes should be non-trivial and unique
- validate/sanitize kid name input
- rate limit obvious abuse paths if public
- do not expose robot MAC addresses in parent-facing UI
- do not expose internal admin functionality on public routes

### Not required yet
- elaborate auth stack
- full RBAC
- user accounts for parents

---

## Open decisions
These are still open, but should stay narrow:
1. exact setup code format and length
2. whether codes are one-time claim codes or reusable setup keys
3. exact greeting line after name sync
4. whether greeting mode exists in v1 or waits until later
5. whether robot fetches on boot only, Wi‑Fi connect only, or both

### Current recommended answers
1. short human-friendly alphanumeric code
2. reusable for now unless that causes a clear problem
3. one fixed greeting line is enough for first implementation
4. greeting mode can wait unless nearly free
5. fetch on Wi‑Fi connect and on boot

---

## Non-goal reminders
If anyone tries to expand this PRD too early, push back.

This site does **not** need to be:
- an app ecosystem
- a curriculum portal
- a polished dashboard suite
- an AI product
- a parent control center

It needs to do one job well:
**connect the robot setup code to a saved kid name so the robot can personalize itself.**

---

## Definition of done for website v1
Website v1 is done when:
- `mojbot.com/start` exists
- parent can enter a printed setup code
- parent can enter a kid name
- backend stores config on correct robot record
- robot fetches config by MAC address
- robot says the kid’s name after sync
- the whole loop works reliably on at least one real robot

That is enough.
Anything beyond that is dessert.

