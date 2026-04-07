---
name: readme-metrics-dashboard
description: Refresh repository metrics, render a full chart dashboard (line, bar, area, pie, scatter, composed), and update README with a reproducible example.
---

# README Metrics Dashboard Skill

## Use When

- The user asks to update README examples
- The user asks for project metrics dashboard updates
- The user asks for language/tech stack summaries with charts

## Required Workflow

1. Generate fresh metrics JSON:
   - Run: npm run metrics:repo:write
   - Source script: scripts/repo-metrics.cjs
   - Output file: doc/repo-metrics.json

2. Regenerate the dashboard screenshot:
   - Run: npm run metrics:screenshot
   - Source script: scripts/screenshot-chart-dashboard.cjs
   - Output file: doc/screenshots/chart-grid.png
   - Requires internet access (loads React 18 + react-is from jsdelivr CDN at render time)

3. Build dashboard data from doc/repo-metrics.json using all chart types:
   - line: trend-style comparison across ranked language buckets
   - bar: lines per language
   - area: cumulative lines by language rank
   - pie: file share by language
   - scatter: files vs lines per language
   - composed: files (bar) + lines (line) per language

4. Display dashboard in chat by calling display_chart with:
   - charts[] containing all six chart types
   - title set to a repository metrics heading
   - layout set to grid when possible

5. Update README with a reusable example section that includes:
   - One command block showing how to regenerate metrics JSON
   - One tool payload example for display_chart using the generated metrics
   - Short note that metrics are snapshot-based and should be regenerated before releases

## Validation Checklist

- Ensure all six chart types are present in the payload
- Ensure README example references doc/repo-metrics.json
- Ensure command names match package.json scripts
- Keep the README example deterministic and copy-paste ready
