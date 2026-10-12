<div align="center">

# ALENT.RED Desktop

**The face for local AI agents.**

A cross-platform desktop app for building and running AI agents that operate your computer — mouse, keyboard, screen, code, and the shell — to achieve goals you describe in plain language.

[![Download for macOS](<https://img.shields.io/badge/Download-macOS%20(Apple%20Silicon)-000000?style=for-the-badge&logo=apple&logoColor=white>)](https://github.com/alent-red/alent-red-desktop/releases/latest/download/Alent.Red-macos-arm64.dmg)
[![Download for Windows](<https://img.shields.io/badge/Download-Windows%20(x64)-0078D4?style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmZmZmZiIgZD0iTTAgMy40IDkuOCAydjkuNkgwem0xMS0xLjZMMjQgMHYxMS42SDExek0wIDEyLjRoOS44VjIyTDAgMjAuNnptMTEgMGgxM1YyNGwtMTMtMS44eiIvPjwvc3ZnPg==>)](https://github.com/alent-red/alent-red-desktop/releases/latest/download/Alent.Red-windows-x86_64-setup.exe)

</div>

---

## 🪟 What is this?

ALENT.RED Desktop is an application for running AI agents on your own computer. You describe a goal in plain language; the agent sees your screen, moves the mouse, types, runs code and shell commands, and keeps going until the goal is reached.

You create providers, models, agents, and bricks here; you chat with agents and watch them operate the machine in real time.

Everything stays on your machine. Conversations, history, and configuration are stored locally; your API keys never leave the device. The only outbound calls are the ones made to the LLM providers you configure.

## 💡 Why it exists

Most AI assistants can talk about your computer; very few can use it. ALENT.RED exists for the tasks that need hands, not just words: filling in a back-office form, moving data between two apps that don't integrate, running a routine that spans the browser, the terminal, and a desktop app. You describe the outcome, the agent does the clicking.

It is built to be lived in rather than tried once: native on macOS and Windows, fast, local-first, with your keys and your history staying on your machine. And because an agent is only as useful as the places it can be reached, agents can also answer you from a chat app on your phone through gateways.

## ✨ Features

- **Multi-provider, multi-LLM** — configure Anthropic, OpenAI (Chat Completions _and_ Responses), LM Studio, or any compatible custom endpoint. Bring your own keys; add as many providers and models as you like.
- **Agents** — create agents with a prompt, a model, reasoning depth, verbosity, a picture, and a set of bricks. Each agent owns its own conversations.
- **Bricks** — compose an agent's capabilities from modular tool bundles: UI control, system access, code execution, scheduling, and more.
- **Gateways** — connect an agent to an external chat platform and drive it from anywhere. Telegram today; the UI is built for more.
- **Live chat** — a streaming conversation view with markdown rendering, tool-call status, image previews, file attachments, message editing, and conversation splitting — all updating in real time over streaming RPCs, no polling.
- **Guided onboarding** — a first-run flow walks you from zero to a working agent: grant permissions, add a provider, pick a model, and you're talking to your first agent.
- **Native & frameless** — a custom titlebar, traffic-light-aware layout on macOS, branded window chrome on Windows, light/dark/system themes with zero flash, and window behaviors like always-on-top and hide-from-screen-capture.
- **Auto-updating** — the app checks for new releases and updates itself, verifying every download with a signature.
- **Local-first** — no telemetry on your data. Your conversations and configuration are the core's, stored on your device.

## 📖 Concepts

The vocabulary you'll see across the app — the same model the core exposes, surfaced as UI:

| Concept          | What it is                                                                                            |
| ---------------- | ----------------------------------------------------------------------------------------------------- |
| **Provider**     | A configured connection to an LLM backend (Anthropic, OpenAI, LM Studio, custom).                     |
| **LLM Model**    | A specific model on a provider, with its limits and options (context window, max tokens, cache, …).   |
| **Agent**        | The actor you talk to: a prompt + a model + reasoning/verbosity settings + a set of bricks.           |
| **Brick**        | A capability an agent can use — a bundle of tools (UI, Code, System, Scheduler, …).                   |
| **Conversation** | A thread of messages owned by an agent. May start locally or arrive from a gateway.                   |
| **Message**      | One turn: your input, an AI reply, an internal note, or a tool call and its result.                   |
| **Gateway**      | A bridge to an external messaging platform (e.g. Telegram) that feeds messages in and relays replies. |

## 🧠 The core

This repository is the **desktop app only**. The agents themselves run in the [**ALENT.RED Core**](https://github.com/alent-red/alent-red-core) — a separate, open-source gRPC server that handles providers, tools, conversations, storage, and gateways.

- In a **packaged build**, the desktop ships the core inside its signed bundle and launches it automatically. You install one app; there is nothing else to set up.
- In **development**, you run the core yourself (see [Quick Start](#-quick-start)).

Building and running the core is out of scope for this repository — see the core project for its own instructions.

## 📦 Requirements

To **run the packaged app**, nothing — download, install, done (see [releases](#-install)).

To **develop the desktop**, you'll need:

- **Node.js** (LTS) and **npm**
- **Rust** (stable, via [rustup](https://rustup.rs))
- **protoc** — the Protocol Buffers compiler (`brew install protobuf` on macOS; your package manager elsewhere)
- The [Tauri platform toolchain](https://tauri.app/start/prerequisites/) for your OS
- **The ALENT.RED Core**, running locally on `127.0.0.1:50051`

## 🚀 Quick Start

> The desktop needs the **core** running. In development it does **not** bundle or launch the core — it connects to one you run yourself on `127.0.0.1:50051`. (A packaged build does this for you.)

```bash
# 1. Start the core — clone and run the ALENT.RED Core project,
#    following its own instructions, until it's listening on 127.0.0.1:50051.

# 2. Clone this repo
git clone https://github.com/alent-red/alent-red-desktop.git
cd alent-red-desktop

# 3. Install dependencies
npm install

# 4. Launch the desktop with hot reload
npm run app:dev
```

`npm run app:dev` opens the native window with Vite HMR for the frontend and a live Rust build for the sidecar. On launch the app connects to the core; if the core isn't up yet, you'll see a connection screen with a retry button — start the core and retry.

## ⚙️ How It Works

```
   ┌──────────────────────────────────────────────────────────┐
   │                  ALENT.RED Desktop (this repo)            │
   │                                                           │
   │   ┌─────────────────────┐         ┌────────────────────┐  │
   │   │   Webview (React)   │◄───────►│   Rust sidecar     │  │
   │   │  windows · features │  Tauri  │  commands · DTOs   │  │
   │   │  · shared           │  (IPC)  │  · streams · error │  │
   │   └─────────────────────┘         └─────────┬──────────┘  │
   │                                             │             │
   └─────────────────────────────────────────────┼─────────────┘
                                                  │ gRPC over 127.0.0.1
                                                  ▼
                                          ALENT.RED Core
                                   agents · providers · tools
                                   · conversations · gateways
```

The webview never speaks gRPC. The UI calls **Tauri commands**; the Rust sidecar translates each into a gRPC call to the core, maps the response back into a typed shape, and returns it. Long-lived data (the conversation list, the messages in a thread) arrives over **server-streaming RPCs**: the sidecar forwards each save/delete event to the webview as a Tauri event, and the UI applies it live. Errors travel one path — a single `AppError` type from the core through the sidecar into a friendly toast or inline message.

For the full architecture — every layer, every rule, and the reasoning behind it — see [`CLAUDE.md`](CLAUDE.md).

## 🗂️ Project Layout

```
alent-red-desktop/
├── protos/                 # the gRPC contract shared with the core
├── src/                    # frontend — React 19 + TypeScript
│   ├── windows/            #   top-level webviews (main window, settings window)
│   ├── features/           #   one folder per domain, fully vertical
│   │                       #   (agents, conversations, messages, providers,
│   │                       #    llm-models, bricks, gateways, …)
│   └── shared/             #   cross-cutting infrastructure + UI primitives
├── src-tauri/              # the Rust sidecar
│   └── src/
│       ├── commands/       #   Tauri commands + DTOs — the IPC surface
│       ├── grpc/           #   tonic client + generated proto bindings
│       ├── streams/        #   server-streaming RPC plumbing
│       ├── core_sidecar/   #   bundled-core lifecycle (packaged builds)
│       └── error.rs        #   the single AppError pipeline
└── CLAUDE.md               # the architecture & conventions contract
```

The dependency direction is strict and one-way: `shared/` ← `features/` ← `windows/`. State is split between [TanStack Query](https://tanstack.com/query) (server data) and [Zustand](https://github.com/pmndrs/zustand) (UI state), with a dedicated streaming pattern for live lists. The full rationale is in [`CLAUDE.md`](CLAUDE.md).

## 🤝 Contributing

Contributions are welcome. This codebase takes its own quality seriously, so the bar is real — but the tooling makes it easy to hit, and everything about _how_ the code is structured lives in [`CLAUDE.md`](CLAUDE.md). Read it first; it is the single source of truth for conventions, patterns, and the reasoning behind them, and it applies equally to human contributors and AI coding agents.

### Set up your environment

```bash
git clone https://github.com/alent-red/alent-red-desktop.git
cd alent-red-desktop
npm install
```

### The commands

| Command              | What it does                                                                      |
| -------------------- | --------------------------------------------------------------------------------- |
| `npm run app:dev`    | Daily driver — Vite + native window with hot reload.                              |
| `npm run app:build`  | Gated release build (Rust checks, then `tauri build`).                            |
| `npm run check`      | **The full gate** — TypeScript, ESLint, Prettier, rustfmt, Clippy, `cargo check`. |
| `npm run web:check`  | Frontend gate only (typecheck + lint + format).                                   |
| `npm run rust:check` | Rust gate only (fmt + Clippy + check).                                            |

### Before you open a PR

One gate, and it's the one CI enforces:

```bash
npm run check   # must be green
```

For UI changes, also run the app (`npm run app:dev`) and exercise the feature — a passing typecheck is not proof a screen works.

### The standards, in brief

The full rules are in [`CLAUDE.md`](CLAUDE.md), but the headline expectations are:

- **Clean & SOLID** — one concept per file, explicit names, short focused functions, no over-engineering.
- **Strict typing** — no `any`, no non-null `!`, no escape-hatch casts. If the type system fights you, the type is wrong.
- **No silent errors** — every caught error becomes a typed `AppError` and is surfaced or re-thrown. Never swallowed.
- **One-way layering** — `shared/` ← `features/` ← `windows/`. Lower layers never import from higher ones.
- **Consistency over cleverness** — match the surrounding code so the whole project reads as one hand wrote it.
- **Self-documenting code** — comments explain _why_, never _what_.

### Working with the gRPC contract

The contract with the core lives in `protos/`. The Rust bindings are generated at build time into `src-tauri/src/grpc/generated/` and are committed; the proto files are the shared source of truth with the core. Keep the surface minimal and in lock-step with the core — a desktop and a core that disagree on the contract won't talk.

## 🔨 Building &amp; Releasing

`npm run app:build` runs the Rust checks, builds the frontend, and produces a native bundle with [Tauri](https://tauri.app). A few things worth knowing (full detail is in the maintainer notes):

- **The core ships inside the bundle.** `npm run core:install` fetches the pinned core release from GitHub Releases (version and sha256 in `core.lock.json`) and embeds it, so the packaged app is self-contained and the core inherits the app's OS permissions.
- **macOS** builds are signed and notarized (minimum macOS 11 Big Sur). **Windows** builds are currently unsigned — until code-signing reputation accrues, SmartScreen may warn on first download.
- **Windows requires administrator.** The agent drives mouse and keyboard input, which needs elevation to interact with other elevated windows, so the app shows a UAC prompt on launch. This is intentional, with no opt-out.
- **Auto-update** is signature-verified end to end; the signing keys live only on the release machine, never in the repo.

Releasing is a maintainer task driven by the scripts under `scripts/`: `npm run release` builds, signs, and publishes the host platform's assets to a GitHub release tagged `v{version}`, with the notes read from the matching section of `RELEASE_NOTES.md`.

## 📦 Install

[![Download for macOS](<https://img.shields.io/badge/Download-macOS%20(Apple%20Silicon)-000000?style=for-the-badge&logo=apple&logoColor=white>)](https://github.com/alent-red/alent-red-desktop/releases/latest/download/Alent.Red-macos-arm64.dmg)
[![Download for Windows](<https://img.shields.io/badge/Download-Windows%20(x64)-0078D4?style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmZmZmZiIgZD0iTTAgMy40IDkuOCAydjkuNkgwem0xMS0xLjZMMjQgMHYxMS42SDExek0wIDEyLjRoOS44VjIyTDAgMjAuNnptMTEgMGgxM1YyNGwtMTMtMS44eiIvPjwvc3ZnPg==>)](https://github.com/alent-red/alent-red-desktop/releases/latest/download/Alent.Red-windows-x86_64-setup.exe)

The links above always fetch the latest release. Every version, with its notes, is on the [GitHub Releases](https://github.com/alent-red/alent-red-desktop/releases) page. The packaged app bundles the core and manages it automatically — install and run, nothing else to set up.

## 📬 Contact

- **Anything** — [hello@alent.red](mailto:hello@alent.red).
- **Bugs and feature requests** — open an issue on the relevant repository: [core](https://github.com/alent-red/alent-red-core/issues) or [desktop](https://github.com/alent-red/alent-red-desktop/issues).
- **Security** — please do not open a public issue; email [security@alent.red](mailto:security@alent.red).

## 🔗 Links

- **Architecture &amp; conventions** — [`CLAUDE.md`](CLAUDE.md)
- **The core** — [ALENT.RED Core](https://github.com/alent-red/alent-red-core)
- **Issues** — https://github.com/alent-red/alent-red-desktop/issues
