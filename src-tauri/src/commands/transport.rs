use tauri::{AppHandle, State};

use crate::commands::dto::transport::TransportStatusDto;
use crate::core_sidecar::spawn::ensure_core_running;
use crate::error::AppResult;
use crate::state::AppState;

#[tauri::command]
pub async fn transport_connect(
    state: State<'_, AppState>,
    app_handle: AppHandle,
) -> AppResult<TransportStatusDto> {
    let endpoint = ensure_core_running(&state, &app_handle).await?;
    let endpoint_url = format!("http://127.0.0.1:{}", endpoint.port);
    state.grpc.set_endpoint(endpoint_url).await?;
    state.grpc.reconnect().await?;
    Ok(TransportStatusDto { connected: true })
}

#[tauri::command]
pub async fn transport_status(state: State<'_, AppState>) -> AppResult<TransportStatusDto> {
    Ok(TransportStatusDto {
        connected: state.grpc.is_connected().await,
    })
}
