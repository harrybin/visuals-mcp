# Changelog

All notable changes to this project are documented in this file.

This changelog was reconstructed from mainline git history (`master`) using version changes in `package.json`.

## [1.6.0] - 2026-04-07

Release commit: `319b8d4`

### Added
- Interactive chart support with Recharts, including line, bar, area, pie, scatter, and composed chart types.
- Repository metrics dashboard flow and related documentation/scripts.

### Changed
- Packaging and tool metadata updated for chart-enabled visuals.

## [1.5.7] - 2026-02-17

Release commit: `dd8fbda`

### Changed
- Publishing/version synchronization updates across `package.json` and `server.json`.
- Documentation cleanup in README.

## [1.5.6] - 2026-02-17

Release commit: `8442b75`

### Fixed
- VS Code installation and publish-script reliability improvements.

### Changed
- Publishing script migration (`npm-publish.js` -> `npm-publish.cjs`) and related release plumbing.

## [1.5.5] - 2026-02-17

Release commit: `619632a`

### Changed
- Added/updated release scripts and synchronized server package metadata.

## [1.5.4] - 2026-02-17

Release commit: `94aaff0`

### Added
- Project logo and VS Code install URL improvements.

## [1.5.3] - 2026-02-17

Release commit: `b2333fe`

### Changed
- Patch release version bump and packaging alignment.

## [1.5.2] - 2026-02-17

Release commit: `2b492bf`

### Fixed
- Restored overwritten README content.

## [1.5.1] - 2026-02-15

Release commit: `47625f8`

### Added
- `server.json` configuration for MCP interactive visualizations.

## [1.5.0] - 2026-02-12

Release commit: `f97f46d`

### Added
- Master-detail visualization workflow and supporting docs/stories.
- Marketplace-oriented MCP metadata in package configuration.

### Changed
- Dependency updates and project metadata refinements.

## [1.4.0] - 2026-02-11

Release commit: `ecabd64`

### Added
- Tree visualization with expand/collapse, selection, and export-oriented behavior.

## [1.3.0] - 2026-02-11

Release commit: `1c8a9a9`

### Added
- Adjustable list visualization with drag-and-drop and list-oriented interactions.

## [1.2.0] - 2026-02-06

Release commit: `2b3c178`

### Added
- Multi-app structure for image and table display apps.
- Vite-based app bundling configuration for MCP UI resources.

## [1.1.0] - 2026-02-06

Release commit: `5663496`

### Added
- Table export functionality (CSV, TSV, PDF).
- UI toast notifications and dedicated table export logic.

### Changed
- Cleanup of obsolete docs and project setup improvements.

## [1.0.1] - 2026-02-06

Release commit: `83ee33c`

### Changed
- Refactored table app structure to use `TableView`.

## [1.0.0] - 2026-02-05

Release commit: `54b8326`

### Added
- Initial MCP visuals server with interactive table visualization.
