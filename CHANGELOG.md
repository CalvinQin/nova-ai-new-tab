# Changelog

All notable changes to NOVA are documented here.

## [0.2.0] - 2026-08-24

### Added

- An optional local Server Pulse panel for up to two named servers, with up to three endpoint or port checks per server.
- Server presets and visual identities for 宝塔, Cloudflare, Alibaba Cloud, DigitalOcean, Vercel, and custom services.
- Explicit, user-initiated health checks. Endpoint origins are requested only when the user chooses **Connect & verify** or **Refresh**; no credential is stored or transmitted.

### Fixed

- Reworked quick-link sorting so dnd-kit alone owns the sortable node's transform, while the drag handle is registered as the activator. This removes the transform contention that caused visual drift.
- Constrained quick-link reordering to one horizontal axis and made keyboard movement deterministic by adjacent position.
- Softened ambient motion and removed blur-heavy Settings transitions for a steadier, less distracting interface.

## [0.1.3] - 2026-08-24

### Fixed

- Kept the command bar in the same layout slot when Focus Mode is toggled, eliminating the vertical re-centering jump. Focus Mode now hides surrounding content without unmounting it or applying a separate offset.

## [0.1.2] - 2026-08-24

### Added

- English and Simplified Chinese in-product language switch with inline SVG flags and local persistence.
- 豆包, Kimi, 通义千问, and 腾讯元宝 as China AI destinations with safe clipboard handoff.
- 百度 as a first-class search engine and `/baidu` slash command.
- Drag-and-drop ordering for AI providers and search engines in Settings; the saved order drives the command-bar picker.

## [0.1.1] - 2026-08-24

### Added

- English and Simplified Chinese extension metadata for Chrome Web Store distribution.
- Reproducible Chrome Web Store artwork generation and exact-dimension validation.
- Store listing copy, privacy declarations, reviewer instructions, and real-browser promotional screenshots.

### Fixed

- Kept the 12-shortcut limit intact when an Undo action races with a newly added shortcut.
- Restored focus to provider controls after keyboard dismissal and exposed Keyboard help in the command palette.
- Made the About version derive from package metadata and verified package/manifest version parity.
- Improved command-palette fit at 1280 × 800 and respected reduced-motion settings across Framer Motion.

## [0.1.0] - 2026-08-24

### Added

- Universal AI, search, URL, calculator, and slash-command input.
- Six AI providers and eleven search destinations.
- Customizable, draggable quick links with inline validation and undo deletion.
- Local-only recent destination metadata with prompt privacy.
- Three-step onboarding, command palette, Focus Mode, themes, accents, and reduced-motion support.
- Chrome Manifest V3 package with only the `storage` permission.
- Responsive layouts verified at desktop and 390 × 844 viewport sizes.
