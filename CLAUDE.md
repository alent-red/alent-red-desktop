# CLAUDE.md — ALENT.RED desktop contract

This file is the engineering contract for everyone working in this repository — human contributors and AI agents alike. It captures the **rules and the architecture** in force today.

Read it before you write code. When a rule here conflicts with personal preference, the rule wins. When in doubt, ask.

Tooling-enforced rules (formatting, linting, type strictness) are **not** duplicated here — read the configs (§14). The configs are the single source of truth for what tooling accepts; this file is the source of truth for what tooling cannot enforce on its own.

---

## 1. What ALENT.RED is

ALENT.RED is a desktop app for autonomous AI agents that operate a computer — mouse, keyboard, screen understanding, code, the shell — to achieve a user's goals. It is multi-provider and multi-LLM, extensible through a **Bricks** capability model, and can be driven from external chat platforms through **Gateways**.

The desktop is a **Tauri 2** app:

- **Frontend** — React 19 + TypeScript, a multi-HTML window architecture (one Vite bundle per window). No React Router; each window is an independent webview.
- **Rust sidecar** — owns all gRPC communication with a bundled Python core. Tauri commands are the IPC surface; webviews never speak gRPC directly.
- **Python core** — a black-box gRPC server shipped inside the signed desktop bundle. We control the binary, never its source. Protos live in `protos/` at the repo root.

State is split: **TanStack Query** for server data, **Zustand** for UI state, and a **snapshot + live-stream** pattern for streamed lists.

The error pipeline flows one way: Rust `AppError` (with `ErrorCode`) → IPC → JS `AppError` class → `presentError` → toast or inline UI.

---

## 2. Quick start

```bash
# 1) Install dependencies (also fetches the pinned Python core on first run)
npm install

# 2) Run the core yourself in dev — the desktop expects it on 127.0.0.1:50051
#    (in production the desktop spawns the bundled core itself)

# 3) Launch the desktop with HMR
npm run app:dev
```

### Commands

| Command                         | What it does                                                                   |
| ------------------------------- | ------------------------------------------------------------------------------ |
| `npm run app:dev`               | Daily driver. Vite + native window with HMR.                                   |
| `npm run app:build`             | Gated release build (`rust:check` then `tauri build`, which runs `web:build`). |
| `npm run check`                 | Full project gate: `web:check && rust:check`.                                  |
| `npm run web:check`             | TypeScript typecheck + ESLint (`--max-warnings=0`) + Prettier check.           |
| `npm run rust:check`            | `cargo fmt --check` + Clippy + `cargo check`.                                  |
| `npm run core:install`          | Download + verify + extract the pinned Python core for this platform.          |
| `npm run core:update <version>` | Re-pin the core to a new version.                                              |

`npm run check` is the gate. Every change must pass it before it is reported done.

---

## 3. Project layout

### TypeScript — `src/`

```
src/
├── windows/         # the "pages" — one folder per webview
├── features/        # one folder per domain, fully vertical (apis, queries, views, stores, actions, …)
└── shared/          # cross-cutting infrastructure and views
```

The dependency direction is one-way: `shared/` ← `features/` ← `windows/`. Lower layers never import from higher layers.

**`windows/{window}/`** — per-window webview. Each has `index.tsx` (entry), `{window}.tsx` (composition), `views/`, optional `stores/`, `actions/`, `types/`, `queries/`. Each window has its own HTML at the repo root and its own Vite bundle. Current windows: `main-window/`, `settings-window/`.

**`features/{feature}/`** — one folder per domain. Subfolders, all optional except where the feature actually uses them: `apis/` (Tauri command wrappers), `queries/` (TanStack hooks), `views/` (composed UI), `constants/`, `data/` (stream-driven state), `lib/` (domain-local pure helpers), `types/`, `stores/`, `actions/`, `events/`. Current features: `about`, `agents`, `blob`, `bricks`, `conversations`, `gateways`, `llm-models`, `messages`, `permissions`, `preferences`, `providers`, `signup`, `theme`, `toasts`, `transport`, `window-behavior`.

**`shared/`** — cross-cutting infrastructure. Subfolders: `views/` (UI with no domain knowledge), `hooks/` (generic React hooks), `lib/` (pure functions), `invoke/` (IPC plumbing), `stores/` (truly cross-cutting Zustand stores), `events/` (cross-window Tauri event constants), `i18n/` (translation), `styles/`, `types/` (cross-cutting types used by 2+ features), `assets/` (brand imagery).

**No barrel files.** Never `index.ts` re-exports. Always import from the file that defines the symbol. The path is the documentation.

### Rust — `src-tauri/src/`

```
src-tauri/src/
├── main.rs            # binary entry — calls lib::run
├── lib.rs             # tauri::Builder + invoke_handler!
├── state.rs           # AppState
├── error.rs           # AppError, ErrorCode, AppResult<T>, From<tonic::Status>
├── grpc/              # gRPC client + tonic-generated code
├── streams/           # tokio stream task helpers (registry + spawn)
├── core_sidecar/      # bundled-core lifecycle (spawn, ports, keyring, paths)
└── commands/          # Tauri commands, one file per domain
    └── dto/           # JS-facing types, one file per domain
```

**One file per domain on the Rust side.** Every Tauri command lives under `commands/{domain}.rs`. Every JS-facing DTO lives under `commands/dto/{domain}.rs`. Domain-cohesive types and impls belong in the same file.

**No `pub use` re-exports.** Module files (`mod.rs`) declare submodules only. The path documents the location.

---

## 4. How we work on quality

Treat software like craft. The bar is high and it is the line we never cross.

- **Think first, code later.** Explore, challenge with better alternatives when you have them backed by facts, agree, then write code. Don't start coding before there's agreement on non-trivial work.
- **Don't add what wasn't asked for.** No drive-by features, no "I also fixed X." If you spot a real bug, surface it and ask before touching it.
- **Validate every change.** `npm run check` must pass. For UI changes, exercise the feature in a running app — and if you can't, say so explicitly rather than claiming success on type-check alone.
- **No bulk find-and-replace** (`sed`, global replace) across files. Each site is decided by its own purpose; a blind replace has caused visual regressions here before.

Project-specific working preferences, communication style, and the historical migration record live outside this file (a maintainer-private `CLAUDE.local.md` and `MIGRATION.md`, both gitignored). This file is only the engineering contract.

---

## 5. Language-agnostic rules

These apply identically across TypeScript and Rust.

**No dead code.** Unused exports, unused private functions, unused fields, `#[allow(dead_code)]`, commented-out blocks — all forbidden. If something is unused today, delete it. Write it again when you need it.

**No silent error handling.** Every caught error is transformed into a structured `AppError`, surfaced to the user, or rethrown. Empty catch arms are forbidden.

**No silent fallbacks.** Every failure path is typed and either propagates or shows in a documented UI surface.

**No abbreviations.** Names are spelled out. The caught variable is `caught`, not `err`. The event is `event`, not `e`. The previous value is `previous`, not `prev`. The only acceptable shorts are universally understood (`id`, `url`, `ttl`, `pid`, `os`, `db`, `dom`, `ui`, `ux`). Single-letter parameters are forbidden except where a trait signature requires one (e.g. Rust's `f: &mut Formatter`).

**Comments are rare.** Default to none. Add a comment only when the WHY is non-obvious — a hidden constraint, a subtle invariant, a workaround for a specific bug, behavior that would surprise a reader. Never explain WHAT the code does (names already do that). Never reference a task, commit, issue, or PR. One short line maximum; no multi-paragraph docstrings.

**No logging in production paths.** No `println!` / `eprintln!` / `dbg!` (Rust). No `console.log` (TS — `console.warn` / `console.error` are allowed by ESLint, used sparingly). This is a high-security desktop app; errors propagate through `AppError` to the UI.

**No emojis** in code or output unless explicitly requested.

**One concept per file.** Each file holds one runtime concept — a function, a hook, a class, a component, a constant, or one domain's command surface (Rust). The exact boundary is language-specific (§6 for TS, §7 for Rust).

---

## 6. TypeScript rules

### 6.1 Type discipline

`tsconfig.json` runs maximal strictness and ESLint runs the strict + stylistic type-checked presets. Read both before coding (§14). On top of what tooling enforces:

- **No `any`. No `!` non-null assertion. No `as unknown as T`. No `as never`.** If the type system fights you, the type is wrong — fix the type, don't cast around it. (`as const`, and the narrow `value as Union` cast that Radix's string-valued `onValueChange` forces, are the pragmatic exceptions; everything else is suspect.)
- **Classes only when a framework forces them** — React error boundaries (`componentDidCatch` has no hook equivalent) and custom error types via `extends Error` (`instanceof` checks). No service classes, namespace classes, or logic-container classes.

### 6.2 File splitting

**One runtime export per file.** Each `.ts` / `.tsx` exports exactly one runtime concept — a function, hook, class, component, or constant.

**Supporting type declarations that describe the shape of that export live in the same file** — a component's Props, a hook's return-type interface, a store's state interface, a function's parameter/result type. They have no meaning independent of the runtime concept and are exported so callers name the shape directly (no `ReturnType<typeof X>` plumbing).

**Internal-only declarations stay unexported** — helper functions, file-local constants, intermediate types used only inside the file.

**A type moves to its own file when its meaning is independent of any single runtime concept** — a domain entity, a wire shape, a value reasoned about by multiple unrelated consumers. The test: does any caller construct, name, or reason about this type for a purpose other than calling the primary export? If yes → its own file.

**Discriminator consts and their derived types share a file** (the `as const` object + the type derived from it — one runtime export, value/type pair sharing a name).

**Compound components split** — `Dialog` + `DialogContent` + `DialogHeader` + … become one file per component. Consumers fan out their imports.

**When in doubt, split.** A wrongly-split file costs one import line. A wrongly-merged file costs git-blame imprecision, IDE-navigation noise, and merge-conflict surface. The asymmetry is permanent.

A file with 2+ peer top-level components that are not sub-parts of one main component, or one component >300 lines with multiple distinct readable-as-standalone sub-concerns, gets split. Inline sub-components used in exactly one place and not generic stay inline — don't over-split.

### 6.3 File-internal ordering

Every file is top-to-bottom: **imports** (alphabetical groups, ESLint-enforced) → **supporting types and file-local constants** (ordered by dependency; shape before value) → **internal-only helpers / private sub-components** → **the exported runtime concept (always last)**. Every name is defined above its first use; no forward references within a file.

Inside a React component body: **hooks** → **derived locals** → **event handlers** → **effects** → **early returns** → **JSX return**. The component-body order is a soft guideline (a handler reading only hook state may sit near it); the file-level order is strict.

### 6.4 Conventional naming

Casing, filename casing, import order, type-only import syntax, and React component declaration form are enforced by ESLint and Prettier. The conventional rules tooling can't enforce:

- **Acronyms are capitalized as words.** `Ui` not `UI`, `Api` not `API`, `Url` not `URL`, `Id` not `ID`, `Llm` not `LLM`.
- **Filenames track the exported symbol.** Rename the symbol → rename the file.
- **Booleans always carry a prefix** — `is*` (state), `has*` (possession), `can*` (permission), `should*` (recommendation), `did*` (past event). Bare adjectives are forbidden: `expanded` → `isExpanded`.
  - _Exempt:_ view components forwarding a boolean straight to a native HTML attribute keep the attribute name (`disabled`, `readOnly`, `checked`, `required`, `multiple`, `autoFocus`). Applies only to leaf primitives; higher-level components with their own boolean semantics still take a prefix.
  - _Exempt:_ TS types mirroring a Rust DTO preserve the wire field names from serde's `camelCase` rename (renaming breaks the JSON contract). Boolean wire fields like `processing` keep their name.
- **Function verbs follow English imperatives.** A preferred (not closed) vocabulary, grouped by intent:
  - _Pure:_ `compute*`, `format*`, `parse*`, `read*`, `apply*`, `present*`, `to*`, `validate*`, `extract*`, `truncate*`, `encode*` / `decode*`, `build*`, `group*`, `clamp*`, `find*`, `compare*`, `normalize*`, `describe*`, `coerce*`, `resolve*`, `detect*`, `canonicalize*`.
  - _Side-effectful:_ `load*`, `draw*`, `set*`, `register*`, `attach*` / `detach*`, `open*` / `close*`, `pick*`, `toggle*`, `submit*`, `bootstrap*`, `update*`, `remove*`, `run*`, `mark*`, `invoke*`, `push*`, `enqueue*`.
  - _Event handlers:_ `handle*` (internal handler), `on*` (handler as a prop name).
  - When a verb you need isn't listed, prefer the closest one above; if none fit, use the clearest common English verb and stay consistent with surrounding code. No jargon, no abbreviations.
- **Hooks:** list query `use{Entities}`; single-entity query `use{Entity}`; mutation `use{Verb}{Entity}`; panel-data `use{Entities}PanelData`; single-entity live `use{Entity}LiveData`; generic `use{What}`.
- **Folder/section singular vs plural:** plural when it holds multiple items of a kind (`windows/`, `features/`, `queries/`, `views/`, `actions/`, `stores/`, `types/`, `events/`); singular when single-concept (`lib/`, `i18n/`, `styles/`, `invoke/`, `data/`). Feature folders match the proto domain name (plural for multi-entity domains like `agents`/`gateways`, singular for single-concept like `transport`/`blob`).
- **i18n top-level section keys match the feature folder name** (same plural/singular rule).
- **Async cancellation uses `AbortController`**, never `let cancelled = false`. Capture the signal, check via an `isAborted()` function, and `.abort()` in the effect cleanup.

### 6.5 Discriminated unions and closed-set strings

**Every closed-set string type is an `as const` object plus a type derived from it**, sharing a name. This holds for _any_ closed set — wire enums, dialog routers, phase machines, _and component-local state unions_. The bare string literal is allowed **only** inside the `as const` definition itself.

**Consumers reference variants through the const**, never as bare literals (`dialog.type === DialogType.CreateAgent`, not `=== 'CREATE_AGENT'`).

**The wire string stays SCREAMING_SNAKE_CASE** for Rust serialization compatibility. The const-object indirection is a TS-side ergonomics layer.

**Exhaustive switches use `assertNever`** (`shared/lib/assert-never.ts`) as the default case.

### 6.6 Imports & React

- **No relative imports** — `@/` paths only. The alias survives file moves; relative paths break.
- Import order, alphabetical sorting, `import type`, and the no-barrel rule are ESLint-enforced.
- **No `autoFocus` on form fields.** The single exception is the message composer textarea (chat-app convention: focus on mount and after send).

---

## 7. Rust rules

### 7.1 File splitting

**One file per domain.** Every Tauri command for a domain in `commands/{domain}.rs`; every JS-facing DTO in `commands/dto/{domain}.rs`. The type, its `TryFrom<Proto>` impl, its `into_proto(self)` method, and related sub-structs stay together. **No `pub use` re-exports** — consumers import from the defining file.

### 7.2 Conventional naming

Casing and core lints are enforced by `rustc` + Clippy (read `Cargo.toml` `[lints]` and `rustfmt.toml`). The conventional rules:

- **No single-letter parameters** (except `f: &mut Formatter` in `Debug`/`Display`).
- **No `_clone` / `_copy` / `_ref` suffixes** — name by purpose, not by Rust mechanism.
- **Tauri command naming:** unary `{domain}_{verb}` (`agents_get_all`, `agents_save`); streams `{domain}_watch_{event}_start` / `_stop`. Plural domain when the proto service is plural.

### 7.3 Command shape

Every Tauri command is `async`, returns `AppResult<T>`, and (when state is needed) takes `state: State<'_, AppState>` first. gRPC clients come from `state.grpc.{service}().await?` — never inline raw tonic clients. For single-call commands with no DTO conversion (deletes, pauses), chain the gRPC call directly off `state.grpc.{service}().await?`.

### 7.4 DTOs

Every DTO derives `Debug, Clone, Serialize, Deserialize`. `#[serde(rename_all = "camelCase")]` at the **struct level** (per-field `rename` forbidden). Discriminated unions use `#[serde(tag = "type", rename_all = "SCREAMING_SNAKE_CASE", rename_all_fields = "camelCase")]`.

- **Proto → DTO**: `impl TryFrom<ProtoType> for DtoType` with `type Error = AppError`. Always `TryFrom`, even when currently infallible — uniformity wins.
- **DTO → Proto**: `pub fn into_proto(self) -> ProtoType` — consuming, owned, no internal clones.
- Required `Option`-wrapped wire fields are checked with `ok_or_else(|| AppError::invalid_response("..."))?`, naming the specific field. Timestamps go through the shared `convert_timestamp` helper — never silently default.

### 7.5 Errors

Single type, single pipeline: `AppError { code: ErrorCode, message: Option<String> }`; `AppResult<T> = Result<T, AppError>`. Use the convenience constructors (`AppError::new`, `::transport`, `::internal`, `::invalid_response`) — don't inline struct literals. `From<tonic::Status>` converts gRPC errors; `?` propagates.

**No `.expect()` / `.unwrap()` in production paths.** The only documented exception is the Tauri builder entry in `lib.rs::run()` (misconfigured bundle, no recovery, `# Panics` doc). Fallback combinators (`.unwrap_or*`) are allowed only when the fallback is the type's defined sentinel or a configuration default.

Error message shape is uniform per kind: `NotFound` from `get` → `"{Domain} not found"`; `Internal` from a `save` returning nothing → `"Save returned no {domain}"`; `InvalidResponse` from a missing field → ``"{TypeName} is missing required `{field_name}` field"``.

### 7.6 Streams

Every server-streaming RPC goes through `spawn_grpc_stream` in `streams/spawn.rs`. Commands never spawn tokio tasks directly. The **deferred-open pattern is a contract**: the gRPC stream is opened _inside_ the spawned task, because some servers delay HTTP/2 response headers until they have data, which would block a synchronous `await` indefinitely. Commands provide `open(grpc)` and `emit(app_handle, item)` closures. Any failure (open, gRPC status, DTO conversion, Tauri emit) surfaces via the `*:stream-error` Tauri event. Stream key naming: `{domain}:watch_{operation}:{identifier_or_star}`.

### 7.7 Visibility, receivers, constants

- **Start tight, widen on demand.** `pub(crate)` for crate-internal, `pub(super)` for module-internal; bare `pub` is reserved for the public API surface (Tauri commands, `run`).
- Method receivers follow the Rust API Guidelines: `&self` reads, `&mut self` in-place mutation, `self` consuming converters. No `to_*` borrowing variants unless a real caller needs both directions.
- Top-level constants are `SCREAMING_SNAKE_CASE` with unit suffixes (`_MS`, `_PX`, `_SECONDS`) and live next to the code that uses them, not in a global config file.
- Every type implements `Debug` (derive when possible; manual `.finish_non_exhaustive()` when an inner type doesn't). No `let _ = x;` to silence warnings; no explicit `drop(var)` before scope exit.

---

## 8. TypeScript architecture

How the rules compose into a working app.

### 8.1 Three layers

`shared/` (cross-cutting infrastructure, knows nothing about features or windows) ← `features/` (one folder per domain, window-agnostic) ← `windows/` (compose features into a UI). Features may depend on other features in a one-way DAG (low-level `transport`/`blob` at the bottom). **Never the reverse.**

### 8.2 Window views vs feature views — the boundary

A **feature view** owns the visual language for its domain's data: its loading / error / empty states, row rendering, retry / filter / select / delete UX. It calls its own query hooks and branches on their state.

A **window view** is composition: it declares window layout, reads window-level UI state, opens dialogs through the window's action helpers, and slots in feature views. A window view does **not** call a feature's query hooks to branch on `isLoading` / `isError` to render domain UX — that branching lives inside the feature-owned view the window slots in. A window may call a feature query for state it genuinely owns (e.g. reconciling a UI selection against a feature's list), but not to make domain-UX decisions.

A management-style window (settings) renders the feature's own `*ManagementView`, passing the window's dialog action helpers as `on*` props. The query call, filter UI, loading/error branching, and list composition all live in the feature.

### 8.3 Window orchestration: `WindowShell`

`WindowShell` (`src/windows/window-shell.tsx`) wraps every window's content and bundles, in order: `QueryClientProvider` (one per window) → `<ConnectionGate>` (holds content until gRPC is up) → `<ErrorBoundary>` → `<ToastViewport>` → cross-window event listeners (theme, window-behavior, update-found broadcasts) → `useTransportHealth()` + `useWindowBehaviorApplier()`. Every `index.tsx` wraps its top-level view in `<WindowShell>`. If a future window needs a different infrastructure stack, define a separate shell — do **not** branch `WindowShell` on window kind.

### 8.4 Window-owned state

Three kinds: **persisted UI state** (per-window Zustand + `persist`, one localStorage key per window, under `windows/{window}/stores/`), **ephemeral state** (`useState` in the window's top component, passed via props), **cross-window broadcasts** (Tauri events; the shell listens, the relevant store applies). Features never own window-local state — a feature hook may _read_ a window's UI store when composed by it, but the store, its persist key, and its broadcast wiring live under the window.

### 8.5 State boundary — TanStack vs Zustand

**TanStack Query owns** server data (providers, llm-models, agents, bricks, gateways, preferences — list and single-entity), plus single-entity caches for agents/conversations/gateways. **TanStack does NOT own** the conversations list or messages list — those live in panel-local state via the panel-data hooks (§8.9).

**Zustand owns** `useTransportStore` (`features/transport/`), `useThemeStore` (`shared/stores/`), `useWindowBehaviorStore` (`features/window-behavior/`), `useAboutStore` (`features/about/`), `useSignupStore` (`features/signup/`), the per-window UI + dialog stores, and `useToastStore`. **Never store server data in Zustand.** Never store local UI state outside Zustand if it should survive a reset.

### 8.6 Store mutation discipline

**Outside a store's owning feature/window**, code must not call store mutators directly (no `useXxxStore.getState().mutator(...)`, no `useXxxStore((s) => s.mutator)`). External mutations go through named action helpers under the owner's `actions/` folder — thin, one file one helper, one store each. Reading state via the store hook is fine. **Window UI stores are exempt** — their mutators are called by views composed within the same window (including slotted feature views); the read/write boundary is contained.

### 8.7 Mutation invalidation

Domain-focused, no cross-domain invalidation. **Save** → `setQueryData(entity(id), saved)` + `invalidateQueries(ownList)`. **Delete** → `removeQueries(entity(id))` + `invalidateQueries(ownList)`. **Never** invalidate other domains — cascade is the server's job. Conversations and messages diverge: their list state is panel-local, so their mutation hooks are pure RPC with no `onSuccess` cache writes — stream events propagate.

### 8.8 Dialog routing

Each window with dialogs opened from multiple sections owns its router: `stores/{window}-dialogs-store.ts` (discriminated-union state + `open`/`close`), `types/{window}-dialog-type.ts` (the `as const` discriminator), `types/{window}-dialog-state.ts` (the union), `actions/` (one file per open path + `close-{window}-dialog.ts`), and `views/{window}-dialogs.tsx` (the router, switching on `dialog.type`, mounted at the top of the window). When a dialog is opened from only one view, local `useState` is the simpler tool. The two windows have **independent** routers — do not unify them.

### 8.9 Streaming data — panel-data hooks

The conversations list, messages list, and single-conversation live view use a **snapshot + live stream** pattern:

1. **Warm paint** — read the relevant cache key once; seed local state if present.
2. **Register stream listeners synchronously.** Events arriving before fresh data go into a panel-local buffer.
3. **Sequential bootstrap** — `await watch_*_start → … → getAll`. Any failure → error phase.
4. **Apply snapshot** — drain the buffer in arrival order, update state, mirror to the TanStack cache (one-way, for next-mount warm paint only).
5. **Mark ready** — subsequent stream events apply directly via O(n) sorted insert.

Mutation hooks for conversations/messages are pure RPC, no `onSuccess` cache writes. Cancellation uses the `AbortController` + `isAborted()` pattern.

### 8.10 Form pattern

Every form: local state per editable field → `validate(values)` returning `Record<string,string>` → `useFieldErrors(values, validate)` (tracks touched + a show-all flag; exposes `errorFor`, `touch`, `touchAll`, `isValid`). Inputs wire `onBlur={() => fieldErrors.touch(name)}` + `isInvalid={Boolean(errorFor(name))}` + `<FieldError message={errorFor(name)} />`. Submit: `preventDefault()` → `touchAll()` → bail if `!isValid || mutation.isPending`. **The submit button is never `disabled` on validity** — only on `mutation.isPending`. Clicking with errors triggers `touchAll`, revealing every error inline.

### 8.11 Form bootstrap

Forms load fresh server data **once**, then freeze it. The pattern: the **outer dialog** owns all server queries; **`<FormBootstrap queries={[...]}>`** gates children on first-fresh-fetch + a minimum delay (≥ the dialog open-animation duration), shows loading until ready, error state on failure, then renders children and never re-gates; the **inner form** receives all server data as props and **snapshots every prop into `useState` on construction**. No `useEffect`-based re-seeding. Cascades fetch all in bootstrap, snapshot, filter locally. Pickers take their option lists as props — they do not fetch. **Edit forms fetch by id, never accept the row object** (that would bypass the fresh-data contract).

### 8.12 Error pipeline

One direction: Rust builds `AppError { code, message }` → `tonic::Status` trailing metadata → JS `invoke()` wraps any error into the `AppError` class (`shared/invoke/`), and on a transport-coded failure reports through `transport-failure-reporter` (an IoC slot the transport feature fills) → UI calls `presentError(error)` → `{ code, title, detail }` → toast or inline. Toast via the `features/toasts/actions/` helpers: `toastError(caught)` for errors, `toastDanger/Warning/Success/Info(title, detail?)` for plain messages. All 12 `ErrorCode` values have friendly translations under `error.*`.

### 8.13 Connection gate and transport health

`<ConnectionGate>` holds every window until gRPC is up, with phases `idle`/`connecting` (delayed logo + spinner to suppress flash) → `connected` (renders children) → `failed` (error UI with Retry that triggers `transport_connect` and rebuilds the channel). Recovery is automatic: with `staleTime: 0`, every query observer refetches when the gate re-mounts children; stream hosts re-subscribe by remount. Three signals flip transport to `failed`: a unary call erroring with `code === Transport`, a `*:stream-error` event, or a heartbeat failure (a real `infoApi.get()` round-trip every 10s while connected). `markFailed` is idempotent.

### 8.14 i18n

Every user-facing English string lives in `shared/i18n/dictionaries/en.ts`; components and validators use `translate(key)`. `TranslationKey` is a recursive template-literal type derived from the dictionary, so stale keys become compile errors. Top-level section names match the feature folder pattern. Exception: messages thrown by `throw new Error(...)` are developer-facing and need not be translated; all other user-visible strings do.

### 8.15 First-run gates

The main window runs three gates before the regular UI, in order:

1. **Signup gate** (`features/signup`) — a one-time lead-capture screen on first launch (see §10 for its external-egress exception). A single persisted bit in `useSignupStore`.
2. **Onboarding gate** (`windows/main-window/.../onboarding`) — Welcome → Permissions (macOS only) → Provider → optional FirstModel → Finalizing. A persisted bit in `useMainWindowOnboardingStore`; the in-flight step is component-local `useState` over a discriminated union. Steps reuse the existing feature forms (`ProviderForm`, `LlmModelForm`) with onboarding-specific `hide*` / `onSaved` props. Finalizing is idempotent (find-or-create by name / id) and triggered via `useMutation` with an attempt-keyed ref so StrictMode double-mount can't fire writes twice.
3. **`<PermissionsRequiredGate>`** — mounted on every subsequent launch when macOS permissions are missing; reuses the onboarding `PermissionsStep`. Permission status refetches on window focus so granting in System Settings auto-reflects.

---

## 9. Rust architecture

### 9.1 Sidecar role

The Rust sidecar owns all gRPC with the Python core. JavaScript never speaks gRPC — it calls Tauri commands, the sidecar translates to gRPC and back. Reasons: tamper security (the JS bundle is embedded in the signed Rust binary), a single proto-bindings codebase, and a capability-allowlisted IPC surface.

### 9.2 Command surface & DTO pipeline

One file per domain under `commands/`; DTOs under `commands/dto/{domain}.rs`; cross-cutting DTO helpers in their own domain file (e.g. timestamp conversion in `dto/timestamp.rs`), not a generic "common" bucket. Proto → DTO via `TryFrom`; DTO → Proto via consuming `into_proto`. DTOs serialize to camelCase JSON; discriminated unions use `tag = "type"` + SCREAMING_SNAKE_CASE variants + camelCase fields. JS receives `{ "code": "NOT_FOUND", "message": "..." }` for errors and the camelCase shape for entities.

### 9.3 Streams

All server-streaming RPCs go through `streams/spawn.rs::spawn_grpc_stream`, which encapsulates the deferred-open pattern, the loop, error handling, and registry registration. The `StreamRegistry` (`streams/registry.rs`) keys tasks and aborts a previous task at the same key. Stream errors (open failure, gRPC status, DTO conversion, Tauri emit) all surface as `*:stream-error` Tauri events with an `AppError` payload.

### 9.4 Core sidecar lifecycle

`core_sidecar/` owns the bundled Python core's lifecycle, split by build profile via `#[cfg(debug_assertions)]`:

- **Dev** — `ensure_core_running` returns a fixed endpoint (`127.0.0.1:50051`); the developer runs the core themselves. The rest of the module is `cfg`-gated out.
- **Production** — `transport_connect` orchestrates: reuse a live child if present, else kill strays → resolve + create the app-data `core/{database.db, blob/}` dirs → load-or-generate a 32-byte encryption key from the OS keyring → pick a free loopback port → spawn the bundled binary with the data/key/port args → install the child into `AppState` → poll `Info.get_info()` until healthy (up to 30s). Shutdown SIGKILLs the child on `RunEvent::Exit` (SQLite WAL is crash-safe; `kill_on_drop(true)` is the backstop).

The same `transport_connect` command is the entry point for both profiles — JS has zero awareness of dev vs prod. Crash recovery rides the existing transport-health signals (§8.13): a failure flips the gate to `failed`, Retry calls `transport_connect`, which detects the dead child and respawns. There is no crash-loop protection — a deterministically-crashing core needs a fixed core release.

### 9.5 Tauri event names

Rust-side event-name constants live next to the publisher (the command file that emits them). The TS side keeps a per-feature registry under `features/{feature}/events/`. Two sources of truth, kept in sync by reviewer discipline — intentional, because Rust has one publisher per event while TS has many subscribers across windows and features.

---

## 10. External boundaries

The desktop is **local-first and gRPC-only by default**: webviews talk to the Rust sidecar through Tauri commands, the sidecar talks to the local Python core over gRPC on loopback, and user data (conversations, history, configuration) stays on the device. The webview does **not** open external network connections — with one sanctioned exception.

**Signup is the one external-egress carve-out.** On first launch the `signup` feature posts a lead (name, email, country, kind, app version, install id) directly from the webview to a Supabase REST endpoint. The post must succeed before the user gets in; a failure shows an inline error and the form stays available for retry. This is deliberate and bounded:

- It is the **only** place the webview makes an external HTTP request. No other feature may open external network from the webview — route anything else through the Rust sidecar.
- The Supabase publishable key in the client is public by design (Supabase's threat model); access is constrained server-side by Row-Level Security (INSERT-only for the anonymous role, no SELECT/UPDATE/DELETE).
- It captures only the signup form fields plus an app version and a per-install id — never conversation content, prompts, or any core data.

If you add a feature that needs to reach the outside world, it does not get to copy this pattern — it goes through the sidecar, and the boundary rule above is what review checks against.

---

## 11. The gRPC contract surface

The Python core is a black-box gRPC server on `127.0.0.1:<port>` (the port is dynamic in production, configurable via `transport_connect`).

**10 services:** `Info`, `Preferences`, `Providers`, `LlmModels`, `Agents`, `Bricks`, `Gateways`, `Conversations`, `Messages`, `Blobs`.

**4 server-streaming RPCs:** `WatchConversationSaves`, `WatchConversationDeletions`, `WatchMessageSaves`, `WatchMessageDeleteAfters` — long-lived per subscriber.

**12 error codes** (via trailing metadata `error-code`): `INVALID_ARGUMENT`, `NOT_SUPPORTED`, `NOT_ALLOWED`, `NOT_FOUND`, `DUPLICATED`, `RELATION_VIOLATION`, `RATE_LIMIT`, `INVALID_RESPONSE`, `TIMEOUT`, `INTERNAL`, `UNKNOWN`, and the client-only `TRANSPORT` (never sent by the server).

**Discriminated unions in proto use `oneof`.** Rust DTOs translate each variant into a serde-tagged enum; JS sees `{ type: "ANTHROPIC", apiKey: "..." } | …`.

**Stream errors** arrive via `Status`, not trailing metadata. The Rust task loop converts `Status` → `*:stream-error` Tauri event with an `AppError` payload; the transport-health hook listens.

---

## 12. Cross-language coordination

- **The `ErrorCode` union is mirrored.** Source of truth is Rust (`error.rs`); TypeScript mirrors it in `shared/types/error-code.ts`. Adding a code touches both.
- **The wire `AppError` (Rust struct) and `AppErrorPayload` (TS interface) are the same JSON.** The TS interface is honestly typed (`code: string`) because Rust can evolve faster — the JS `AppError` class coerces unknown codes to `ErrorCode.Unknown` while preserving the original message.
- **Tauri event names are duplicated by design** (Rust publisher + TS registry), kept aligned by reviewer discipline.
- **Field naming across the boundary:** Rust fields are `snake_case`; serde's struct-level `rename_all = "camelCase"` converts at the JSON boundary; TS sees `camelCase` everywhere.

---

## 13. Design system

Design tokens (colors, motion, shadows, radius) live as CSS variables in `src/shared/styles/globals.css`, with light and dark variants via `:root[data-theme="dark"]`. Colors are consumed through utility classes (`bg-surface`, `text-primary`, `border-default`, `text-brand`) — never raw `var(--...)` in component code, never hardcoded hex. The brand color is `--color-brand`, the Alent.Red red (`--color-brand-600` `#DE0402` in light mode, `--color-brand-500` `#FB3A3A` in dark mode), with white text on it.

- **Pre-paint theme script.** Each window's HTML has an inline `<head>` script that reads localStorage + `prefers-color-scheme` and sets `data-theme` + body background **before any HTML renders** (zero FOUC). Never remove it; new windows copy it verbatim.
- **Frameless macOS window** (`decorations: true` + `titleBarStyle: "Overlay"` + `hiddenTitle: true`), native traffic lights at (16, 18), HTML under a 40px `--titlebar-safe-area` strip. Windows gets an equivalent borderless look via a frame plugin (see MIGRATION.md for the platform-specific glue).
- **Drag region** uses the `data-tauri-drag-region` attribute, which applies to the element _and its subtree_. There is no `no-drag` opt-out — put it only on empty space (spacers, the safe-area strip, flex-1 gaps).
- **Logo assets** live in `src/shared/assets/` (icon = the "AR" mark alone, logo = mark + "Alent.Red" wordmark; light + dark). Always render through `<LogoIcon>` / `<Logo>`, never `<img src>` directly — they pick the variant from the resolved theme.
- **Markdown** renders through `<MarkdownText>` (`react-markdown` + GFM), reserved for AI-authored content; user messages render as plain text. External links open in the system browser via `tauri-plugin-opener`.

Typography, radius, motion, icon sizes, and z-index tokenization is partially in place. Until a token exists for a given role, use the existing CSS variable directly via `style={{}}` rather than introducing a new raw literal.

---

## 14. Tooling — the configs are the source of truth

`npm run check` is the gate (TypeScript typecheck, ESLint, Prettier, rustfmt, Clippy, `cargo check`). Inspect `package.json` for the exact script composition.

**Read these before coding** — they define what tooling enforces, and this file does not duplicate them:

- `tsconfig.json` — TypeScript strictness.
- `eslint.config.js` — lint rules (strict + stylistic type-checked, naming conventions, import order, no-default-export, no-relative-imports).
- `.prettierrc.json` — formatting.
- `src-tauri/Cargo.toml` — Rust lint levels (`[lints]`).
- `src-tauri/rustfmt.toml` — Rust formatting.

---

## 15. UX decisions (locked)

- No auto-trim at API boundaries — strict validators, not data transformers. Trim only at submit time, via `trimSpaces` (strips SPACES only, matching the core's `v.strip(" ")`; newlines and tabs are content).
- No default values where the user should choose (provider type, brick type, gateway type pickers have no default).
- Placeholders only on Select / Combobox / message composer — never on a labeled Input or Textarea (the label is the affordance). Search placeholders end without an ellipsis.
- Empty states are generic ("Add a provider to get started"), never enumerating types.
- API-key, bearer and gateway-token fields use `type="password"`. The core still echoes stored secrets back on edit, so the masked value is the real one.
- Dialog titles drop the entity name on edit.
- Editing a user message replaces it and deletes every message after; the save requires explicit confirmation through `ConfirmDeleteDialog` because it is destructive.
- Tool-call statuses use three distinct colors: in-progress `--text-secondary` (muted), error `--color-danger`, success `--color-success`. Brand red is never used for in-progress — it reads as failure.
- Avatar color hashing treats `.` as a word separator (so `Alent.Red` and `Alent Red` collide); the name "Alent.Red" (any casing, dotted or spaced) is special-cased to the brand color with the initial "A".
- **Conversations** show the agent name on top (the user's mental anchor) and a secondary line below. A conversation originating from a Gateway renders a **diagonal-split avatar** (agent on one half, external sender on the other) with a small platform badge, and surfaces the sender's name/username in the secondary line.
- **Coming-soon features** are shown disabled with a "Coming soon" tooltip rather than hidden. The `KindPicker` primitive carries this directly (`KindOption.disabled` + `disabledTooltipKey: 'common.comingSoon'`, wrapped in a Radix Tooltip via a `<span>` because disabled buttons swallow pointer events). Reuse this pattern — don't fork it.
- **Window behavior** — "Always on top" defaults OFF; "Hide from screenshots and screen recording" defaults OFF and is switched ON when the onboarding creates the first agent. Both live in `features/window-behavior/` (broadcast across windows), and each window's `WindowShell` applies them to its own webview. Linux has no `setContentProtected` equivalent — the toggle is disabled there with a tooltip and the call short-circuits.
- **Sidebar collapse** (main window) — only the conversations panel collapses; the agent rail stays visible so the brand is never hidden. Clicking any agent (or All) auto-reopens the panel; the + button does not. The window minimum size adapts to sidebar state at runtime.

---

## 16. Distribution & build

The build, signing, and update pipeline is summarized here as **rules a contributor must respect**. The deep build internals (icon authoring, NSIS chrome, platform-specific window glue, regeneration procedures, the bugs they work around) are recorded separately in MIGRATION.md.

- **Version source of truth is `package.json#version`.** `tauri.conf.json#version` is the literal string `"../package.json"` (Tauri reads the package version at build time). `src-tauri/Cargo.toml#package.version` is pinned to `0.0.0` and never bumped — a dead field Cargo requires. Release scripts read `package.json#version`.
- **The Python core ships inside the codesigned bundle** (not extracted to app-data) so macOS TCC permissions inherit from the parent `.app`. The core is fetched from the core's GitHub Releases (`https://github.com/{owner}/alent-red-core/releases/download/v{version}/alent-red-core-{platform}.zip`, verified against its `.sha256` sidecar). `core.lock.json` at the repo root pins the core version and per-platform SHA-256 hashes; the extracted core under `src-tauri/resources/core/` is gitignored and reproducible via `npm run core:install`.
- **Distribution scripts** live under `scripts/` (shared helpers in `scripts/_lib/`). `npm run release [force] [no-confirm]` runs the full pipeline (preflight → build → stage → confirm → publish) against **GitHub Releases** through the `gh` CLI: one release per version tagged `v{version}` (created by the first platform, on a clean and pushed HEAD), one asset set per platform (`Alent.Red-{platform}.dmg` + `.app.tar.gz` + `.sig` on macOS, `Alent.Red-{platform}-setup.exe` + `.sig` on Windows), notes read from the `## {version}` section of `RELEASE_NOTES.md` (the release is refused when the section is missing). Existing assets are never overwritten without `force` plus a typed confirmation. The repository is inferred from `origin` by `gh`, so the script holds no organization name. `release` is the **only** script that reads `.env` (via `dotenv-cli`); core/build/dev scripts rely on the existing shell environment.
- **macOS releases are signed + notarized**; **Windows releases are currently unsigned** (SmartScreen warnings until Authenticode signing lands). Pre-signing nested core Mach-O binaries before `tauri build` is mandatory on macOS — Tauri's `--deep` codesign skips `Contents/Resources/`, so the release script signs the core tree first or notarization rejects the submission.
- **Reproducible build paths.** The release script copies the repository to a fixed, machine-neutral location (`/tmp/alent-red-build/alent-red-desktop` on macOS, `%ProgramData%\alent-red-build\alent-red-desktop` on Windows; `.git`, `target/`, `release/` and `dist/` excluded, `node_modules` and the staged core included), builds there with `--remap-path-prefix` for that root (`/build`) and the home directory (`/home/builder`), stages the artifacts back into `release/`, then removes the copy. The crate directory recorded by the compiler and every source path in panic locations and debug info therefore read the same whatever machine produced the release. Release profiles strip symbols. A release built any other way must follow the same steps.
- **Entitlements** (`src-tauri/entitlements.plist`) start empty. Add an entitlement only when a launch error proves it's needed — never preemptively weaken the security posture.
- **Auto-update** uses the Tauri updater plugin against a fixed endpoint, `releases/latest/download/latest.json` on the desktop repository: a single `latest.json` per release carries every platform, and the release script merges its platform into the published manifest before re-uploading it. The updater verifies payloads with a **minisign** signature (a separate keypair from codesign). The public key is committed in `tauri.conf.json`; the private key lives only in the release environment. Losing it means existing users can never auto-update again. The core ships inside the desktop, so a core hotfix is a desktop release — single update channel, no version skew.
- **Minimum OS:** macOS Big Sur 11.0, Windows 10 v1709 — both dictated by the bundled Nuitka-compiled core, and both at or below the WebView2 floor.

---

## 17. Security & safety rules

- **Never read `.env`.** It holds production secrets (Apple Developer ID, app-specific password, Team ID, the Tauri updater private key + passphrase). Reading it leaks them into the conversation, transcript, and any downstream telemetry. To learn what keys it declares, read `.env.example` (sanitized, safe). To check whether a variable is set, ask a maintainer to run `echo "VAR set: ${VAR:+yes}"`. Never `cat`, `Read`, or `grep` `.env` or any `.env.*` variant except `.env.example`.
- **No secrets in logs, no user content in logs.** The standing policy is no logging in production paths at all (§5). Any future logging must be gated to debug builds, must never log secrets, and must never log user-typed text (messages, prompts) or wire error messages (which can echo user content). Error codes are fine; IDs only in dev.
- **The Windows binary requires administrator** (embedded manifest, UAC on every launch) because the agent drives mouse/keyboard input and must run elevated to interact with elevated windows. There is no opt-out; this is intentional.
- **Panic discipline:** the only sanctioned panic is the Tauri builder entry in `lib.rs::run()` (documented, before any user data exists). A panic elsewhere can leak local variables (secrets, prompts) into stderr or an OS crash dump — so every other path returns `AppError`. Release builds strip symbols.
