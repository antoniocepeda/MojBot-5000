# Rule: Generating a Task List from a PRD

## Why this exists (short and sweet)

Turn a PRD into a buildable task list a junior dev can follow without guesswork.

## What’s different vs. the original

* **Ask 1 question at a time** until there’s enough context to plan.
* **Two-phase output**: parent tasks first, then sub‑tasks only after you say **“Go.”**
* **Plain Markdown** saved to `/tasks/` with predictable filenames. No extra ceremony.

---

## Output

* **Format:** Markdown (`.md`)
* **Location:** `/tasks/`
* **Filename:** `tasks-[prd-file-name].md`
  Example: `tasks-0001-prd-user-profile-editing.md`

---

## Process (lean)

1. **Receive PRD reference** → You point to a specific PRD filename.
2. **Analyze PRD** → Read goals, user stories, functional reqs, acceptance criteria, scope.
3. **Assess current state** → One-question rounds to learn repo structure, frameworks, conventions, and any existing components/utilities to reuse.
4. **Phase 1: Generate Parent Tasks** → Create the high‑level tasks (about five, use judgment). Present them in the required format, **without** sub‑tasks. Conclude with:
   *“I have generated the high‑level tasks based on the PRD. Ready to generate the sub‑tasks? Respond with ‘Go’ to proceed.”*
5. **Wait for confirmation** → Stop until you reply **“Go.”**
6. **Phase 2: Generate Sub‑tasks** → Expand each parent task into small, actionable steps that follow the PRD and fit the repo’s patterns. Include testing where relevant.
7. **Identify relevant files** → List files to create/modify and their tests under **Relevant Files** with brief reasons.
8. **Finalize** → Combine Relevant Files, Notes, and Tasks into the final Markdown.
9. **Save** → Write to `/tasks/tasks-[prd-file-name].md`.

> The assistant should revise the **same** task file if you later refine scope or order, unless the PRD filename changes.

---

## Clarifying questions protocol

* Ask **1 question at a time**.
* Prefer lettered choices when helpful.
* Stop when you have enough to draft parent tasks: repo tech stack, routing/patterns, testing approach, code style, and any constraints or “do‑nots.”

**Starter question packs (use one at a time):**

* **Repo context**: Which stack are we in? A) Next.js/React B) Node API C) Firebase/Cloud Functions D) Other: ___
* **Testing**: Required tests? A) unit B) integration C) none for v1 D) other: ___
* **Reuse**: Any existing components/services to build on? A) yes (name them) B) no C) unsure
* **Constraints**: Must‑avoid areas for v1? A) migrations B) breaking API changes C) auth changes D) other: ___

---

## Output format (strict)

```markdown
## Relevant Files

- `path/to/potential/file1.ts` – Brief reason (e.g., main component for this feature).
- `path/to/file1.test.ts` – Unit tests for `file1.ts`.
- `path/to/another/file.tsx` – Brief reason (e.g., API route handler for data submission).
- `path/to/another/file.test.tsx` – Unit tests for `another/file.tsx`.
- `lib/utils/helpers.ts` – Utility functions needed for calculations.
- `lib/utils/helpers.test.ts` – Unit tests for `helpers.ts`.

### Notes

- Unit tests should typically live next to the code they test (e.g., `MyComponent.tsx` and `MyComponent.test.tsx`).
- Use your project’s test runner (e.g., `npx jest [optional/path]`) according to the repo config.

## Tasks

- [ ] 1.0 Parent Task Title
  - [ ] 1.1 [Sub-task description 1.1]
  - [ ] 1.2 [Sub-task description 1.2]
- [ ] 2.0 Parent Task Title
  - [ ] 2.1 [Sub-task description 2.1]
- [ ] 3.0 Parent Task Title (may not require sub-tasks if purely structural or configuration)
```

---

## Quality bar

* Parent tasks are outcome‑oriented and map directly to PRD requirements.
* Sub‑tasks are atomic, sequenced, and testable.
* Relevant Files list anticipates where code lives in this repo, not in a vacuum.

---

## Definition of Done

* [ ] Parent tasks approved (you said **“Go”**)
* [ ] Sub‑tasks generated for every parent task or explicitly marked N/A
* [ ] Relevant Files listed with short justifications
* [ ] Notes include test guidance and any setup quirks
* [ ] File saved to `/tasks/tasks-[prd-file-name].md`

---

## Final instructions

1. Do **not** implement code here. Planning only.
2. Always ask **1 clarifying question at a time** before drafting parent tasks.
3. After parent tasks, **pause** until you reply **“Go.”**
4. On updates, **revise the same task file** unless the PRD filename changes.