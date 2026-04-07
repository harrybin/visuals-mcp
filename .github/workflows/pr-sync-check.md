---
description: On every PR, verify and update CHANGELOG.md, README.md, and Storybook stories to stay in sync with the code changes. Pushes fixes to the PR branch and posts a summary comment.
on:
  pull_request:
    types: [opened, synchronize, reopened]
  workflow_dispatch:
  skip-bots: [github-actions, copilot]
permissions:
  contents: read
  pull-requests: read
  issues: read
tools:
  github:
    toolsets: [default]
network:
  allowed:
    - defaults
    - node
steps:
  - name: Install dependencies
    run: npm ci
concurrency:
  group: pr-sync-${{ github.event.pull_request.number }}
  cancel-in-progress: true
safe-outputs:
  add-comment:
    max: 1
  push-to-pull-request-branch:
    max: 1
    if-no-changes: ignore
    allowed-files:
      - CHANGELOG.md
      - README.md
      - src/**/*.stories.tsx
      - storybook-static/**
      - doc/repo-metrics.json
    excluded-files:
      - "**/*.lock"
      - dist/**
---

# PR Sync Check — CHANGELOG, README & Storybook

You are an AI agent. Your job is to keep project docs and UI stories in sync with every pull request in the `harrybin/visuals-mcp` repository.

## Context

This is a **Model Context Protocol (MCP) Server** providing interactive visual components (table, chart, image, list, master-detail, tree) for AI agents in VS Code. The three artefacts that must stay in sync are:

| Artefact | Skill | Scope |
|---|---|---|
| `CHANGELOG.md` | `.github/skills/changelog-release/SKILL.md` | Release history |
| `README.md` | `.github/skills/readme-metrics-dashboard/SKILL.md` | Project docs & features |
| `src/*.stories.tsx` + `storybook-static/` | `.github/skills/storybook-sync/SKILL.md` | Component stories |

---

## Step 1 — Analyse the PR

Use GitHub tools to inspect PR #${{ github.event.pull_request.number }}:

1. List all changed files, noting which belong to `src/`, `server.ts`, `types.ts`, `package.json`, `.github/`, or documentation.
2. Read the PR title and description.
3. Read the current `CHANGELOG.md`, `README.md`, and any `src/*.stories.tsx` files related to changed components.

Classify each changed file as one of:
- **Component change** — `src/*.tsx` (excluding `*.stories.tsx`), affects Storybook
- **API / tool change** — `server.ts`, `types.ts`, affects README and CHANGELOG
- **Config / build change** — `vite.config.*`, `tsconfig*`, `package.json`
- **Doc-only change** — `*.md`, `doc/`, no sync needed

---

## Step 2 — Changelog Sync

Read `.github/skills/changelog-release/SKILL.md` and follow its **Required Workflow** section.

- If any **API, tool, or component change** was detected: verify that `CHANGELOG.md` contains an entry for the current version (from `package.json`) that describes this change.
- If the entry is missing or incomplete: add or amend the relevant section (`Added`, `Changed`, `Fixed`, or `Removed`) using the existing changelog style.
- Do **not** add an `Unreleased` section unless one is already present.
- Do **not** bump the version — only update the notes for the existing version.

---

## Step 3 — Storybook Sync

Read `.github/skills/storybook-sync/SKILL.md` and follow its **Required Workflow** section.

- For every **component change** (`src/*.tsx` excluding stories):
  - Check whether the matching `src/*.stories.tsx` file reflects the current prop API, new states, or changed behaviour.
  - Update or add focused stories as needed — prefer amending existing stories over creating redundant variants.
  - If `src/Introduction.stories.tsx` (the landing/welcome story) is outdated relative to the current component set, update it.
- If any story file was modified during this step: run `npm run build-storybook` to regenerate `storybook-static/`.
- Add the built `storybook-static/` output to the files to be pushed.

---

## Step 4 — README Sync

Read `.github/skills/readme-metrics-dashboard/SKILL.md`.

- Apply this step **only** if the PR introduces:
  - A new visual component (new tool exposed to LLM)
  - A renamed or removed tool
  - A significant change to an existing tool's input schema or behaviour
- Update the relevant README prose sections (component list, supported tools, feature descriptions, data flow).
- Do **not** run `npm run metrics:repo:write` or regenerate the full dashboard — that is reserved for release time.
- Do **not** alter the README sections that show the chart payload example or metrics screenshot.

---

## Step 5 — Push Changes and Post Comment

After completing the above steps:

1. Push all modified files (`CHANGELOG.md`, `README.md`, updated story files, rebuilt `storybook-static/` if applicable) to this PR's branch via the `push-to-pull-request-branch` safe output.
2. Post a comment on PR #${{ github.event.pull_request.number }} with a summary:

```
## 🔄 PR Sync Check

| Check | Status | Notes |
|---|---|---|
| CHANGELOG.md | ✅ Already in sync / 🔄 Updated / ⚠️ Needs attention | ... |
| README.md | ✅ / 🔄 / ⚠️ | ... |
| Storybook stories | ✅ / 🔄 / ⚠️ | ... |
| Storybook build | ✅ / 🔄 / ⏭️ Skipped (no story changes) | ... |
```

Use:
- ✅ Already in sync — no change needed
- 🔄 Updated — pushed a fix to this PR branch
- ⚠️ Needs human attention — explain why (e.g. breaking change may require a major version bump, or metrics dashboard should be regenerated before this release)
- ⏭️ Skipped — not applicable for this PR

If nothing at all needed updating, call the `noop` safe output instead of posting a comment, with message "All artefacts are in sync with this PR."

---

## Guidelines

- Be conservative: when in doubt, leave a file unchanged and note it in the comment.
- Do **not** modify `package.json`, `tsconfig*.json`, `vite.config.*`, `server.ts`, `types.ts`, or any source implementation files.
- Do **not** run any publish or release commands (`npm run publish:*`, `npm version`, `git tag`).
- Do **not** push changes to `dist/` or `node_modules/`.
- Focus only on the three tracked artefacts: CHANGELOG, README, and Storybook.
