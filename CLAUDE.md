# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm install` — install frontend and Tauri CLI dependencies.
- `npm run dev` — start the Vite dev server at `http://localhost:1420` for browser-based development.
- `npm run build` — run `vue-tsc --noEmit` and build the Vue frontend into `dist/`.
- `npm run preview` — preview the built frontend locally.
- `npm run tauri dev` — run the desktop app in development mode. Requires Rust/Cargo to be installed.
- `npm run tauri build` — build the desktop app bundle. Requires Rust/Cargo to be installed.

No test runner or lint command is configured yet.

## Architecture

This is a Tauri 2 desktop Pomodoro timer with a Vue 3 + Vite + TypeScript frontend.

The frontend entry point is `src/main.ts`, which mounts `src/App.vue`. `App.vue` composes the UI from presentation components in `src/components/` and obtains all timer state/actions from `src/composables/usePomodoro.ts`.

`usePomodoro.ts` is the main application logic module. It owns the timer state (`work` / `break`, remaining seconds, completed Pomodoros, running state), derives display values, persists lightweight state to `localStorage`, updates `document.title`, and uses an end timestamp plus a short interval to avoid timer drift.

`TimerDisplay.vue` renders the current phase, `MM:SS` time, progress bar, and completed Pomodoro count. `TimerControls.vue` renders the start/pause and reset controls and emits actions back to `App.vue`.

The Tauri shell lives under `src-tauri/`. `src-tauri/tauri.conf.json` configures the desktop window, frontend dev URL (`http://localhost:1420`), and production frontend dist path (`../dist`). `src-tauri/src/main.rs` currently only starts the default Tauri builder; there are no custom Rust commands or plugins yet.

## Notes

- Browser development can be done with `npm run dev`; full desktop development and packaging require Rust/Cargo.
- Generated directories are ignored via `.gitignore`: `node_modules`, `dist`, and `src-tauri/target`.
