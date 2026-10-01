# Changelog

## 1.2.0 (2026-10-01)

Design Tokens foundation and Web terminal-line components (purely additive, non-breaking):

- **Infrastructure**: Design Tokens single source of truth (`tokens/tokens.json`) generates `tokens.scss` and `tui/src/tokens/index.ts` one-way via `scripts/gen-tokens.js`, hooked into `build:file` / `build:theme`
- **Terminal-line components (2)**: LogViewer (virtual scrolling + lightweight ANSI parsing via ansi-to-html), Terminal (xterm.js emulation, exact-pinned `xterm@5.3.0` and `xterm-addon-fit@0.8.0`; pin rationale and migration path in the component source comments and docs)
- **Command palette**: CommandPalette quick-command overlay (Ctrl+K by default, filtering / keyboard navigation / configurable hotkey and scope, zero new dependencies)
- **In-repo terminal tool**: `tui/` (`@rumo/tui-internal`, private, never published) — a TypeScript + Ink CLI (`npm run tui`) for component-catalog search and Vue code-template export, with three terminal components (LogStream / TerminalPrompt / CommandSelect); auto-degrades to static output on non-TTY; shared colors come from Design Tokens; dependencies fully isolated from the root project
- **i18n**: multi-language fallback chain for missing locale keys (current language → en → zh-CN)
- New engine dependencies: ansi-to-html, xterm, xterm-addon-fit
- Attribution: `NOTICE` and `licenses/` updated accordingly; component docs delivered in both zh-CN and en-US

## 1.1.0

Fused open-source components and assets (purely additive, non-breaking): 21 new component packages and 500 SVG icons:

- **Display (4)**: Text, Watermark, Result, Space (back-ported from Element Plus, MIT)
- **Form & data (9)**: Segmented, CheckTag, Skeleton/SkeletonItem, Descriptions/DescriptionsItem, Statistic, Countdown, AvatarGroup (back-ported from Element Plus, MIT)
- **Third-party (4)**: Splitpanes/SplitPane (from splitpanes v2.4.1), Signature, Qr
- **Motion (3)**: Animate preset component and v-animate directive (powered by animejs), Countup (powered by countup.js), ScrollReveal directive (slim rewrite of AOS)
- **Icons (1)**: SvgIcon component + 500 curated Tabler Icons in 8 groups (importable per group from `src/icons/tabler`)
- New engine dependencies: animejs, countup.js, signature_pad, qrcode
- Attribution: every ported file header names its upstream and version; NOTICE acts as the index; full license texts live in `licenses/`

## 1.0.0

- Initial release
