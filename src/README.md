# EmuSync — Developer Guide

Technical documentation for contributors. If you want to *use* EmuSync, see the user-facing
README at the repo root. This document explains how the codebase is put together, why, and where
to make changes.

---

## 1. What EmuSync is (architecturally)

EmuSync is a **two-process desktop application**:

- **The Agent** — a headless .NET (ASP.NET Core) background service that does all the real work:
  detecting game saves, zipping them, talking to cloud storage, tracking sync state. It runs as a
  **Windows Service** or a **systemd daemon** and listens on `http://localhost:5353`.
- **The UI** — an Electron + React + TypeScript desktop app. It is a **thin client**: it holds no
  business logic and talks to the Agent over local HTTP, exactly like any other API consumer.

The two processes share nothing in-process. The Agent keeps running and syncing even when the UI is
closed, which is what makes the SteamDeck Decky plugin and the public HTTP API possible — they are
just additional clients of the same Agent.

```
                 HTTP (localhost:5353)
   ┌──────────┐  ───────────────────►  ┌─────────────────────────┐      ┌──────────────┐
   │ Electron │                         │   EmuSync.Agent          │ ───► │ Cloud storage│
   │   UI     │  ◄───────────────────   │  (ASP.NET Core service)  │      │ (GDrive/etc) │
   └──────────┘                         └─────────────────────────┘      └──────────────┘
        ▲                                          │
        │  Decky plugin / 3rd-party API consumers  │  reads/writes local JSON + zips
        └──────────────────────────────────────────┘
```

There is **no database**. State lives in local JSON files on disk plus JSON/zip files on the user's
chosen cloud provider — the cloud is used as a "pseudo-database" and as the transport between
devices.

---

## 2. Repository layout

Everything lives under `src/`. The .NET solution is `src/EmuSync.sln`.

```
src/
├── EmuSync.Domain/                     # Core domain: entities, enums, helpers, local-disk primitives.
│                                       # Depends on nothing (the inner layer).
├── EmuSync.Services.Storage/           # Cloud provider abstraction + concrete providers
│                                       # (Google Drive, Dropbox, OneDrive, Shared Folder).
├── EmuSync.Services.Managers/          # Orchestration layer / use-cases (Game, SyncSource, GameSync).
├── EmuSync.Services.LudusaviImporter/  # Game-save location detection via the ludusavi-manifest.
├── EmuSync.Agent/                      # ASP.NET Core host: controllers, DTOs, background workers,
│                                       # middleware, mapping. The composition root.
├── EmuSync.UI/                         # Electron + React client (its own npm project).
│
├── EmuSync.Domain.Tests/            Test projects mirror their source project 1:1.
├── EmuSync.Services.Storage.Tests/
├── EmuSync.Services.Managers.Tests/
├── EmuSync.Agent.Tests/
│
├── Directory.Build.Props            Solution-wide MSBuild props.
└── EmuSync.sln
```

### Backend dependency direction

References point inward only. The Domain layer has no project dependencies; everything depends
(transitively) on it.

```
EmuSync.Agent
   ├─► EmuSync.Services.Managers ─► EmuSync.Services.Storage ─► EmuSync.Domain
   ├─► EmuSync.Services.Storage ───────────────────────────────► EmuSync.Domain
   ├─► EmuSync.Services.LudusaviImporter
   └─► EmuSync.Domain
```

When adding code, respect this direction. The Domain layer must stay free of references to the
storage, manager, or agent layers.

---

## 3. Backend deep dive

### 3.1 Layers and responsibilities

**`EmuSync.Domain`** — pure domain primitives, no external project dependencies.
- `Entities/` — `GameEntity`, `SyncSourceEntity`, `LocalSyncLogEntity`, `LocalGameBackupManifestEntity`.
- `Enums/` — `StorageProvider`, `SyncType`, `GameSyncStatus`, `OsPlatform`.
- `Services/` — local-disk access (`LocalDataAccessor`/`ILocalDataAccessor`), `LocalSyncLog`,
  `LocalGameSaveBackupService`, `SyncProgressTracker`.
- `Helpers/` — `ZipHelper`, `PlatformHelper` (OS detection), `IdHelper`, `IgnoredFileMatcher`.
- `DomainConstants` — the on-disk file/folder names (see §6).

`GameEntity.IgnoredFilePaths` lets a user exclude specific files/folders (relative to the save
folder) from sync — e.g. emulator cache files that churn constantly but don't matter.
`IgnoredFileMatcher` is the single place that interprets this list (paths are compared
case-insensitively with forward slashes, since the list travels between OSes via cloud metadata).
It's threaded through `LocalDataAccessor.ScanDirectory`, `ZipHelper.CreateZipFromFolder`, and
`ZipHelper.ExtractToDirectory`/`DeleteExistingContents`, so ignored files are skipped consistently
during scanning, zipping, and download extraction (an ignored local file survives a download
overwrite instead of being deleted).

**`EmuSync.Services.Storage`** — every cloud backend hidden behind a single interface,
`IStorageProvider`:
```csharp
Task<TData?> GetJsonFileAsync<TData>(string fileName, CancellationToken ct = default);
Task        GetZipFileAsync(string fileName, string writeToPath, Action<double>? onProgress = null, CancellationToken ct = default);
Task        DeleteFileAsync(string fileName, CancellationToken ct = default);
Task        UpsertJsonDataAsync(string fileName, object data, Action<double>? onProgress = null, CancellationToken ct = default);
Task        UpsertZipDataAsync(string fileName, Stream stream, Action<double>? onProgress = null, CancellationToken ct = default);
void        RemoveRelatedFiles();
```
- Each provider gets its own folder (`GoogleDrive/`, `Dropbox/`, `OneDrive/`, `SharedFolder/`) with
  an auth handler and token type. The OAuth providers use a PKCE flow (`PkceHelper`).
- `StorageProviderFactory` (`IStorageProviderFactory`) resolves the concrete provider at runtime —
  either from an explicit `StorageProvider` enum, or by reading the saved `sync-source.json` via
  `CreateAsync`. Providers are resolved from a fresh DI scope.

**`EmuSync.Services.Managers`** — orchestration / use-case layer. `GameManager`,
`SyncSourceManager`, `GameSyncManager` implement the "what to do" logic and sit on a shared
`BaseManager` that lazily resolves and caches the active `IStorageProvider`, so managers express
intent without caring which cloud is behind it. Registered via `services.AddAllManagers(config)`.

**`EmuSync.Services.LudusaviImporter`** — pulls the community
[ludusavi-manifest](https://github.com/mtkennerly/ludusavi-manifest), which maps each game to where
it stores saves per platform. `LudusaviPathMap.Build(...)` resolves the manifest's placeholder
tokens (`<winAppData>`, `<winDocuments>`, `<xdgData>`, etc.) into real OS paths. See §5 for what
this means for detection.

**`EmuSync.Agent`** — the ASP.NET Core host and composition root (see `Program.cs`).
- `Controllers/` — thin controllers over `CustomControllerBase`, which standardizes error responses
  (`NotFoundWithErrors`, `BadRequestWithErrors`, `StatusCodeWithErrors` → `ErrorResponseDto`) and
  request logging.
- `Dto/` + `Mapping/` — request/response DTOs. **Domain entities never cross the HTTP boundary**;
  there is explicit mapping code (and dedicated mapping tests).
- `Middleware/HttpResponseExceptionFilter` — global exception → HTTP response shaping.
- `Services/` — agent-scoped services: `ApiCache`, `GameSyncStatusCache`, `GameSyncService`,
  `SyncTasks` (the queue), `SyncTaskProcessor`, `FluentValidationService`.
- `Background/` — the hosted workers (see §3.3).

### 3.2 Key patterns

- **Dependency injection everywhere**, primary-constructor style. The composition root is
  `Program.ConfigureServices`. Each subsystem exposes a `ServiceCollectionExtensions` registration
  helper (`AddAllManagers`, `AddAllExternalStorageProviders`, `AddLocalDataAccessor`).
- **Interface-per-service** — services live behind an `I...` interface, which keeps them mockable.
  Tests rely on this.
- **Factory** for storage providers (`StorageProviderFactory`).
- **Options pattern** — `GameSyncWorkerConfig` is bound from the `GameSyncWorkerConfig` config
  section.
- **DTO + mapping boundary** at the HTTP edge.
- **FluentValidation** via `IValidationService`; validators are auto-registered with
  `AddValidatorsFromAssemblyContaining<ErrorResponseDto>()`. Note that ASP.NET's automatic
  ModelState handling is intentionally suppressed (`SuppressModelStateInvalidFilter`) — validation
  is done explicitly through the validation service.
- **Serilog** for structured logging (console always; rolling file sink configured in
  `appsettings.json`). Configured via `HostingExtensions.ConfigureSerilog`.

### 3.3 The sync engine

Three `BackgroundService` hosted workers run inside the Agent:

| Worker                  | Responsibility |
|-------------------------|----------------|
| `GameSyncWorker`        | Polls on an interval (driven by the user's `AutoSyncFrequency`, falling back to `GameSyncWorkerConfig.LoopDelayTimeSpan`) and calls `IGameSyncService.TryDetectGameChangesAsync`. |
| `SyncTaskWorker`        | Drains the sync-task queue and performs the actual upload/download work. |
| `LudusaviManifestWorker`| Periodically refreshes the ludusavi manifest used for save detection. |

The queue itself, `SyncTasks`, is a `ConcurrentDictionary<string, GameEntity>` keyed by game id.
Keying by id means re-queuing the same game **coalesces** rather than duplicating.

Workers are singletons, but each loop iteration **creates its own DI scope**
(`_serviceProvider.CreateScope()`) to resolve scoped services such as `IGameSyncService` and
`ISyncSourceManager`. This is the standard pattern for consuming scoped dependencies from a
singleton hosted service — follow it if you add a worker. Progress flows back through
`Action<double>` callbacks and `ISyncProgressTracker`.

`GameSyncWorker` also adds a 30-second startup delay before its first run "to let the system settle".

#### Upload vs. download decision (`GameSyncManager.DetermineSyncType`)

The sync direction is decided by comparing the local `DirectoryScanResult` (from
`LocalDataAccessor.ScanDirectory`, ignore-aware) against the game's stored `LatestWriteTimeUtc` and
`NonIgnoredFileCount`:

- **File write time only** — `DirectoryScanResult.LatestWriteTimeUtc` deliberately reflects only
  non-ignored *file* mtimes, never directory mtimes. A directory's mtime bumps whenever any file
  inside it changes, including an ignored one (e.g. an emulator rewriting a cache file), so it
  can't be trusted to mean "non-ignored content changed" and would otherwise cause spurious
  uploads.
- **Non-ignored file count** — deleting a non-ignored file doesn't bump any *remaining* file's
  mtime, so a drop in `GameEntity.NonIgnoredFileCount` versus the last synced count is the signal
  used to catch that case and still trigger an upload. The check is skipped when there's no stored
  count yet (games synced before this field existed), to avoid a one-time false upload the first
  time they're scanned post-upgrade.

### 3.4 Request lifecycle (example)

Adding a game from the UI:

1. UI `game-api.ts` POSTs to the Agent's `GameController`.
2. The DTO is validated through `IValidationService`.
3. `GameManager` writes the game definition to the local JSON state **and** to the cloud provider's
   game-list file via the resolved `IStorageProvider`.

Separately and continuously, `GameSyncWorker` wakes on its interval, detects changed saves (paths
informed by the Ludusavi manifest), enqueues affected games into `SyncTasks`, and `SyncTaskWorker`
zips the save directory (`ZipHelper`) and pushes the archive to the cloud, emitting progress the UI
can poll via `game-sync-api.ts`.

---

## 4. Frontend architecture (`EmuSync.UI`)

Built on **Electron React Boilerplate** (note the `.erb/` webpack config directory). Standard
Electron split:

- **`src/main`** — `main.ts`, `preload.ts`, `menu.ts`, `util.ts`. Minimal. This process hosts the
  window, native menus, the directory picker, external-link opening, and auto-update. It holds **no
  business logic**.
- **`src/renderer`** — the React app, cleanly layered:
  - `api/` — typed `fetch` wrappers, **one file per Agent controller** (`game-api.ts`,
    `sync-source-api.ts`, …), all routed through a shared `api-helper.ts`.
  - `hooks/` — data-fetching and form hooks (`use-list-query`, `use-edit-form`, …).
  - `views/` — screens (`this-device`, `game`, `all-devices`, `local-sync-history`, `home`,
    `about`). Each view may have its own `components/`, `forms/`, `utils/`.
  - `components/` — reusable UI (alerts, buttons, chips, data grids, skeletons, modals).
  - `state/` — small slices of global client state (`agent-status`, `all-sync-sources`,
    `local-sync-source`, `sidebar-config`).
  - `types/` — TypeScript types mirroring the backend DTOs.

### Frontend stack

- **MUI** (`@mui/material`, `@mui/x-data-grid`) for components.
- **TanStack Query** for server state and caching. Query keys are centralized in
  `api/cache-keys.ts` — reuse them rather than inlining key strings.
- **Jotai** for the small amount of global client state.
- **react-hook-form** for forms, **react-router-dom** for navigation, **notistack** for toasts,
  **dayjs** for dates, **react-remark** for rendering changelog/news markdown.

---

## 5. What EmuSync actually detects (save files)

A common point of confusion: EmuSync has **no concept of "memory card" vs "save state" vs "battery
save."** The unit of sync is a **save *location* (a directory/file path)**, not a file format. When a
tracked location changes, the whole location is zipped and pushed to the cloud. A PS2 memcard, a
native PC `savegame.dat`, and an emulator save are all treated identically — they are just bytes
inside a tracked path.

Detection resolves paths two ways:
1. **The ludusavi-manifest** — community DB of per-game, per-OS save-path templates, resolved by
   `LudusaviPathMap.Build` into concrete `winAppData` / `winDocuments` / `xdgData` / Steam-Proton
   `steamuser` paths.
2. **Hardcoded "other known locations"** (`LudusaviPathMap.GetOtherKnownLocations`) for *Steam
   emulator* / crack-group save folders keyed by Steam game id (Goldberg, SmartSteamEmu, SKIDROW,
   EMPRESS, CreamAPI, …). This is DRM-emulation save relocation — **not** console emulators
   (RetroArch/PCSX2/Dolphin).

So console-emulator saves work only if the manifest covers them, or the user manually points a
game's sync location at the emulator's save folder. A few spots in `LudusaviPathMap` carry
`//probably wrong` author comments around the Steam install root and `LocalLow`; manual path entry
is the reliable route for non-standard installs.

---

## 6. Local data, state, and the Agent↔UI contract

### Local on-disk state

Defined in `EmuSync.Domain/DomainConstants.cs`. Everything lives under a `.emusync-data` folder:

| Constant / file | Purpose |
|-----------------|---------|
| `sync-source.json` | The configured storage provider + this device's sync source. Read by `StorageProviderFactory.CreateAsync` to know which provider to build. |
| `local-sync-log.log` | Local sync history. |
| `game-backups/` + `manifest.json` | Local backup/restore store (default max **10** backups). |
| `temp-zips/` | Scratch space for building archives. |
| `ludusavi-manifest.json`, `ludusavi-last-etag.json`, `ludusavi-cached-scan.json` | Cached manifest + ETag for conditional refresh + cached scan results. |

### The HTTP contract

- The Agent listens on **`http://localhost:5353`** (Kestrel, `ListenLocalhost(5353)` in
  `Program.cs`).
- The UI gets the base URL from the preload bridge: `window.electron.apiUrl`, which is
  `process.env.API_URL ?? "http://localhost:5353"` (see `src/main/preload.ts`). All HTTP goes
  through `api-helper.ts` → `buildUrl`.
- **CORS**: origins come from the `CORSOrigins` config array. If it's empty (the default), the Agent
  allows any origin; if populated, it restricts to those origins and allows credentials.
- Lowercase URLs are enabled globally.
- OAuth redirect URIs point back at the Agent itself, e.g.
  `http://localhost:5353/Auth/Google/AuthFinish` (configured per provider in `appsettings.json`).

### Controllers (current API surface)

`AuthController`, `GameController`, `GameSyncController`, `LocalSyncLogController`,
`SyncSourceController`, `SystemController`. The full API is documented in the project
[wiki](https://github.com/emu-sync/EmuSync/wiki/API-overview).

---

## 7. Tech stack & versions

- **Backend**: .NET 10 (`<TargetFramework>net10.0</TargetFramework>`), ASP.NET Core, Serilog,
  FluentValidation, `Microsoft.Extensions.Hosting.WindowsServices` / `.Systemd`. Cloud SDKs:
  `Google.Apis.Drive.v3`, `Dropbox.Api`, and Microsoft Graph/OneDrive auth.
- **Frontend**: Electron, React, TypeScript, MUI, TanStack Query, Jotai, react-hook-form,
  webpack (via ERB). Node **20** is used in CI.

> Note: the legacy `test-linux.yml` workflow still references .NET `8.0.x`; the active release
> workflow and the csproj target are .NET 10. Use a **.NET 10 SDK** for development.

---

## 8. Getting set up

### Prerequisites

- .NET 10 SDK
- Node.js 20 + npm
- (Optional) Windows or Linux; macOS is not actively built/tested per the maintainer.

### Run the Agent (backend)

```bash
cd src/EmuSync.Agent
dotnet run
```
This starts Kestrel on `http://localhost:5353`. With the default empty `CORSOrigins`, it accepts
any origin, so the dev UI can talk to it without extra config. Logs print to the console and to
`./logs/`.

### Run the UI (frontend)

```bash
cd src/EmuSync.UI
npm install        # first time
npm start          # ERB dev server + Electron with hot reload
```
The UI defaults to `http://localhost:5353` for the API; override with the `API_URL` env var if your
Agent runs elsewhere.

> Run both at once for a working dev environment: Agent in one terminal, UI in another.

### Tests

```bash
# .NET (run from src/ or the repo root)
dotnet test

# UI (jest)
cd src/EmuSync.UI && npm test
```

### Production build / packaging

CI (`.github/workflows/build-and-release.yml`, tag-triggered on `v*`) does, per platform:

```bash
# 1. Publish the Agent as a self-contained single file
dotnet publish src/EmuSync.Agent/EmuSync.Agent.csproj \
  -c Release -r <win-x64|linux-x64> --self-contained true \
  -o <publish-dir> -p:PublishSingleFile=true

# 2. Build the Electron app, which bundles the published Agent
cd src/EmuSync.UI
npm ci
npm run build:win     # or build:linux
```
The Agent binary + `appsettings.json` are copied into the UI's `release/build` tree and packaged
into the installer/AppImage by electron-builder.

---

## 9. Conventions for contributors

- **Respect the layer boundaries** (§2). Domain depends on nothing; don't reach "upward."
- **Never expose domain entities over HTTP** — add a DTO and a mapping, and a mapping test.
- **Put new services behind an interface** and register them through the relevant
  `ServiceCollectionExtensions`.
- **Validation is explicit** via `IValidationService` / FluentValidation, not ModelState.
- **Background workers**: create a DI scope per iteration; don't capture scoped services in the
  singleton worker.
- **Tests mirror source projects 1:1.** Add tests in the matching `*.Tests` project.
- **Frontend**: one api file per controller, route through `api-helper`, reuse `cache-keys`, keep
  business logic out of the Electron main process.

### Where to add common things

- **A new cloud storage provider**: implement `IStorageProvider` in a new folder under
  `EmuSync.Services.Storage/`, add an auth handler + token type, add a `StorageProvider` enum value,
  wire it into `StorageProviderFactory` (both `Create` overloads) and the storage
  `ServiceCollectionExtensions`, and add config + redirect URI to `appsettings.json`.
- **A new API endpoint**: add/extend a controller (inherit `CustomControllerBase`), add request/
  response DTOs + validators + mapping, then add a matching `*-api.ts` function and TanStack Query
  hook on the UI side.
- **A new background job**: add a `BackgroundService` in `EmuSync.Agent/Background/`, register it
  with `AddHostedService`, and follow the per-iteration scope pattern.

---

## 10. Known rough edges

- `LudusaviPathMap` has author `//probably wrong` notes around the Steam install root and
  `LocalLow` handling; non-standard installs may need manual path entry.
- `test-linux.yml` references an outdated .NET 8 SDK and is manual-trigger only.
- No database by design — all persistence is JSON/zip on disk and in the cloud, so concurrency and
  consistency are handled in app code (e.g. the coalescing task queue), not by a datastore.

---

## License

GPL-3.0 (see `LICENSE`).
