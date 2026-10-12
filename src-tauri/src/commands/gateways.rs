use tauri::State;

use crate::commands::dto::gateways::{GatewayDto, GatewayInputDto};
use crate::error::{AppError, AppResult, ErrorCode};
use crate::grpc::generated::gateways as gateways_pb;
use crate::state::AppState;

#[tauri::command]
pub async fn gateways_get_all(
    state: State<'_, AppState>,
    agent_id: Option<String>,
) -> AppResult<Vec<GatewayDto>> {
    let response = {
        let mut client = state.grpc.gateways().await?;
        client
            .get_all(gateways_pb::GetAllGatewaysRequest { agent_id })
            .await?
    };
    response
        .into_inner()
        .gateways
        .into_iter()
        .map(GatewayDto::try_from)
        .collect()
}

#[tauri::command]
pub async fn gateways_get(state: State<'_, AppState>, id: String) -> AppResult<GatewayDto> {
    let response = {
        let mut client = state.grpc.gateways().await?;
        client.get(gateways_pb::GetGatewayRequest { id }).await?
    };
    response
        .into_inner()
        .gateway
        .map(GatewayDto::try_from)
        .transpose()?
        .ok_or_else(|| AppError::new(ErrorCode::NotFound, Some("Gateway not found".to_string())))
}

#[tauri::command]
pub async fn gateways_save(
    state: State<'_, AppState>,
    id: Option<String>,
    gateway: GatewayInputDto,
) -> AppResult<GatewayDto> {
    let response = {
        let mut client = state.grpc.gateways().await?;
        client
            .save(gateways_pb::SaveGatewayRequest {
                id,
                gateway: Some(gateway.into_proto()),
            })
            .await?
    };
    response
        .into_inner()
        .gateway
        .map(GatewayDto::try_from)
        .transpose()?
        .ok_or_else(|| AppError::internal("Save returned no gateway"))
}

#[tauri::command]
pub async fn gateways_delete(state: State<'_, AppState>, id: String) -> AppResult<()> {
    state
        .grpc
        .gateways()
        .await?
        .delete(gateways_pb::DeleteGatewayRequest { id })
        .await?;
    Ok(())
}
