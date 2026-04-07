---
name: storybook-sync
description: Update and validate Storybook after recent component, style, or behavior changes.
---

# Storybook Sync Skill

## Use When

- The user asks to update Storybook for the latest code changes
- UI components, styles, props, or exports changed in src/
- Stories are outdated or missing for new UI behavior
- The user asks to rebuild Storybook static output

## Required Workflow

1. Identify impacted stories from changed files:
   - Check modified files in src/
   - Ensure matching `*.stories.tsx` files are updated for each affected component
   - Prefer adjusting existing stories instead of creating redundant variants
   - If Storybook includes a landing, introduction, or welcome story, update it whenever the component set, naming, supported features, or recommended validation workflow changes

2. Verify story coverage for changed behavior:
   - Keep at least one representative default story
   - Add focused stories for new states/props/edge cases introduced by the change
   - Keep controls and args aligned with current component props
   - Ensure the welcome page accurately reflects the current components surfaced in Storybook and does not mention removed or outdated examples

3. Build Storybook from current sources:
   - Run: npm run build-storybook
   - Expected output directory: storybook-static/

4. (If requested or needed) run interactive Storybook for quick validation:
   - Run: npm run storybook
   - Check impacted stories render and controls behave correctly

5. If repository tracks static output, ensure generated Storybook artifacts reflect latest changes:
   - Confirm story index and built assets are refreshed
   - Keep generated content consistent with source stories
   - Verify the generated introduction or welcome entry reflects the updated source content

## Validation Checklist

- `npm run build-storybook` completes without errors
- Updated stories compile and render expected states
- Story args/controls match current component API
- Welcome or introduction story content matches the current UI surface area and workflow guidance
- No obvious visual regressions in impacted stories
- Any generated Storybook output included by repo policy is up to date
