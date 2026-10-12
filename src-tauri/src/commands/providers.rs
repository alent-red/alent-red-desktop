use tauri::State;

use crate::commands::dto::providers::{ProviderDto, ProviderInputDto};
use crate::error::{AppError, AppResult, ErrorCode};
use crate::grpc::generated::providers as providers_pb;
use crate::state::AppState;

#[tauri::command]
pub async fn providers_get_all(state: State<'_, AppState>) -> AppResult<Vec<ProviderDto>> {
    let response = {
        let mut client = state.grpc.providers().await?;
        client
            .get_all(providers_pb::GetAllProvidersRequest {})
            .await?
    };
    response
        .into_inner()
        .providers
        .into_iter()
        .map(ProviderDto::try_from)
        .collect()
}

#[tauri::command]
pub async fn providers_get(state: State<'_, AppState>, id: String) -> AppResult<ProviderDto> {
    let response = {
        let mut client = state.grpc.providers().await?;
        client.get(providers_pb::GetProviderRequest { id }).await?
    };
    response
        .into_inner()
        .provider
        .map(ProviderDto::try_from)
        .transpose()?
        .ok_or_else(|| AppError::new(ErrorCode::NotFound, Some("Provider not found".to_string())))
}

#[tauri::command]
pub async fn providers_save(
    state: State<'_, AppState>,
    id: Option<String>,
    provider: ProviderInputDto,
) -> AppResult<ProviderDto> {
    let response = {
        let mut client = state.grpc.providers().await?;
        client
            .save(providers_pb::SaveProviderRequest {
                id,
                provider: Some(provider.into_proto()),
            })
            .await?
    };
    response
        .into_inner()
        .provider
        .map(ProviderDto::try_from)
        .transpose()?
        .ok_or_else(|| AppError::internal("Save returned no provider"))
}

#[tauri::command]
pub async fn providers_delete(state: State<'_, AppState>, id: String) -> AppResult<()> {
    state
        .grpc
        .providers()
        .await?
        .delete(providers_pb::DeleteProviderRequest { id })
        .await?;
    Ok(())
}
