use tauri::AppHandle;

use crate::core_sidecar::process::CoreEndpoint;
use crate::error::AppResult;
use crate::state::AppState;

pub async fn ensure_core_running(
    state: &AppState,
    app_handle: &AppHandle,
) -> AppResult<CoreEndpoint> {
    implementation::ensure_core_running(state, app_handle).await
}

#[cfg(not(debug_assertions))]
mod implementation {
    use std::process::Stdio;
    use std::time::{Duration, Instant};

    use tauri::{AppHandle, Manager};
    use tokio::process::Command;
    use tokio::time::sleep;
    use tonic::transport::{Channel, Endpoint};

    use crate::core_sidecar::find_port::pick_free_loopback_port;
    use crate::core_sidecar::keyring::load_or_generate_encryption_key;
    use crate::core_sidecar::kill_strays::kill_stray_cores;
    use crate::core_sidecar::paths::resolve_and_ensure_core_paths;
    use crate::core_sidecar::process::CoreEndpoint;
    use crate::error::{AppError, AppResult};
    use crate::grpc::generated::info as info_pb;
    use crate::state::AppState;

    // Nuitka emits a bare binary on macOS/Linux and a PE .exe on Windows.
    #[cfg(target_os = "windows")]
    const CORE_RESOURCE_RELATIVE_PATH: &str = "resources/core/alent-red-core/alent-red-core.exe";
    #[cfg(not(target_os = "windows"))]
    const CORE_RESOURCE_RELATIVE_PATH: &str = "resources/core/alent-red-core/alent-red-core";
    const HEALTH_CHECK_TIMEOUT: Duration = Duration::from_secs(30);
    const HEALTH_CHECK_POLL_INTERVAL: Duration = Duration::from_millis(250);
    const HEALTH_CHECK_CONNECT_TIMEOUT: Duration = Duration::from_secs(1);

    pub async fn ensure_core_running(
        state: &AppState,
        app_handle: &AppHandle,
    ) -> AppResult<CoreEndpoint> {
        if state.core_process.is_alive().await {
            if let Some(endpoint) = state.core_process.endpoint().await {
                return Ok(endpoint);
            }
        }

        kill_stray_cores();
        let endpoint = spawn_fresh_core(state, app_handle).await?;
        Ok(endpoint)
    }

    async fn spawn_fresh_core(state: &AppState, app_handle: &AppHandle) -> AppResult<CoreEndpoint> {
        let binary_path = app_handle
            .path()
            .resource_dir()
            .map_err(|error| {
                AppError::internal(format!("Failed to resolve resource dir: {error}"))
            })?
            .join(CORE_RESOURCE_RELATIVE_PATH);

        if !binary_path.exists() {
            return Err(AppError::internal(format!(
                "Core binary not found at {}",
                binary_path.display()
            )));
        }

        let paths = resolve_and_ensure_core_paths(app_handle)?;
        let encryption_key = load_or_generate_encryption_key()?;
        let port = pick_free_loopback_port()?;

        let mut command = Command::new(&binary_path);
        command
            .arg("--host")
            .arg("127.0.0.1")
            .arg("--port")
            .arg(port.to_string())
            .arg("--sqlite-path")
            .arg(&paths.sqlite_path)
            .arg("--blob-path")
            .arg(&paths.blob_path)
            .arg("--encryption-key")
            .arg(&encryption_key)
            .arg("--log-level")
            .arg("INFO")
            .arg("--log-format")
            .arg("json")
            .stdin(Stdio::null())
            .stdout(Stdio::null())
            .stderr(Stdio::null())
            .kill_on_drop(true);

        // CREATE_NO_WINDOW (0x08000000) — without it Windows attaches a fresh
        // console window to the Nuitka-compiled core. The flag is a no-op for
        // GUI-subsystem children but the core is compiled as a console app.
        // tokio::process::Command surfaces `creation_flags` directly on Windows
        // builds via its inherent impl, so no extra trait import is needed.
        #[cfg(target_os = "windows")]
        {
            const CREATE_NO_WINDOW: u32 = 0x0800_0000;
            command.creation_flags(CREATE_NO_WINDOW);
        }

        let child = command.spawn().map_err(|error| {
            AppError::internal(format!("Failed to spawn core process: {error}"))
        })?;

        let endpoint = CoreEndpoint { port };
        state.core_process.install(child, endpoint).await;

        wait_until_healthy(endpoint).await?;
        Ok(endpoint)
    }

    async fn wait_until_healthy(endpoint: CoreEndpoint) -> AppResult<()> {
        let endpoint_url = format!("http://127.0.0.1:{}", endpoint.port);
        let started = Instant::now();
        let mut last_error: Option<String> = None;

        while started.elapsed() < HEALTH_CHECK_TIMEOUT {
            match try_health_check(&endpoint_url).await {
                Ok(()) => return Ok(()),
                Err(message) => {
                    last_error = Some(message);
                    sleep(HEALTH_CHECK_POLL_INTERVAL).await;
                }
            }
        }

        Err(AppError::transport(format!(
            "Core did not become healthy within {}s: {}",
            HEALTH_CHECK_TIMEOUT.as_secs(),
            last_error.unwrap_or_else(|| "no response".to_string()),
        )))
    }

    async fn try_health_check(endpoint_url: &str) -> Result<(), String> {
        let channel = Endpoint::from_shared(endpoint_url.to_string())
            .map_err(|error| format!("invalid endpoint: {error}"))?
            .connect_timeout(HEALTH_CHECK_CONNECT_TIMEOUT)
            .connect()
            .await
            .map_err(|error| format!("connect failed: {error}"))?;
        ping_info_service(channel).await
    }

    async fn ping_info_service(channel: Channel) -> Result<(), String> {
        let mut client = info_pb::info_client::InfoClient::new(channel);
        client
            .get_info(info_pb::GetInfoRequest {})
            .await
            .map_err(|error| format!("info.get_info failed: {error}"))?;
        Ok(())
    }
}

#[cfg(debug_assertions)]
mod implementation {
    use tauri::AppHandle;

    use crate::core_sidecar::process::CoreEndpoint;
    use crate::error::AppResult;
    use crate::state::AppState;

    const DEV_CORE_PORT: u16 = 50051;

    // Signature must match the release implementation so the outer wrapper
    // is identical across cfg branches; dev mode does no async work.
    #[allow(clippy::unused_async)]
    pub async fn ensure_core_running(
        _state: &AppState,
        _app_handle: &AppHandle,
    ) -> AppResult<CoreEndpoint> {
        Ok(CoreEndpoint {
            port: DEV_CORE_PORT,
        })
    }
}
