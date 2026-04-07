---
name: changelog-release
description: Keep CHANGELOG.md current for releases and create the matching git tag during publishing.
---

# Changelog Release Skill

## Use When

- The user asks to update `CHANGELOG.md`
- The user asks to prepare or publish a release
- The package version changed or is about to change
- The user wants release notes or git tags kept in sync with published versions

## Required Workflow

1. Confirm the release version source of truth:
   - Read `package.json` and use its `version` field as the release version
   - Keep `server.json` synchronized when applicable via `npm run sync-server-version`

2. Update `CHANGELOG.md` before publishing:
   - Add or revise the top release section using the repository format: `## [x.y.z] - YYYY-MM-DD`
   - Group notable user-facing changes under headings such as `Added`, `Changed`, `Fixed`, and `Removed`
   - Keep entries concise and release-oriented; do not dump commit-by-commit details
   - Preserve the existing changelog style instead of introducing an `Unreleased` section unless the repository is already using one

3. Validate release scope against the working tree:
   - Review the meaningful source, docs, and packaging changes that belong in the release notes
   - Do not describe unrelated dependency churn unless it materially affects users or publishing

4. Publish from the release commit:
   - Prefer the consolidated command: `npm run publish:all`
   - This repository’s publish flow now ends with `npm run publish:tag`, which creates the local annotated git tag `v<version>` if it does not already exist

5. Verify release metadata after publishing:
   - Ensure the changelog version matches `package.json`
   - Ensure the git tag name matches the version exactly: `v<package.json version>`
   - If needed, push the created local tag separately with git once publishing is confirmed

## Validation Checklist

- `CHANGELOG.md` has a correct top release entry for the current version
- The changelog date matches the intended release date
- `package.json` and `server.json` versions are aligned when required
- `npm run publish:all` includes the tag creation step
- `npm run publish:tag` is safe to rerun and skips if the tag already exists
