use tauri::State;

use crate::commands::dto::llm_models::{LlmModelDto, LlmModelInputDto};
use crate::error::{AppError, AppResult, ErrorCode};
use crate::grpc::generated::llm_models as llm_models_pb;
use crate::state::AppState;

#[tauri::command]
pub async fn llm_models_get_all(
    state: State<'_, AppState>,
    provider_id: Option<String>,
) -> AppResult<Vec<LlmModelDto>> {
    let response = {
        let mut client = state.grpc.llm_models().await?;
        client
            .get_all(llm_models_pb::GetAllLlmModelsRequest { provider_id })
            .await?
    };
    response
        .into_inner()
        .llm_models
        .into_iter()
        .map(LlmModelDto::try_from)
        .collect()
}

#[tauri::command]
pub async fn llm_models_get(state: State<'_, AppState>, id: String) -> AppResult<LlmModelDto> {
    let response = {
        let mut client = state.grpc.llm_models().await?;
        client.get(llm_models_pb::GetLlmModelRequest { id }).await?
    };
    response
        .into_inner()
        .llm_model
        .map(LlmModelDto::try_from)
        .transpose()?
        .ok_or_else(|| AppError::new(ErrorCode::NotFound, Some("LlmModel not found".to_string())))
}

#[tauri::command]
pub async fn llm_models_save(
    state: State<'_, AppState>,
    id: Option<String>,
    llm_model: LlmModelInputDto,
) -> AppResult<LlmModelDto> {
    let response = {
        let mut client = state.grpc.llm_models().await?;
        client
            .save(llm_models_pb::SaveLlmModelRequest {
                id,
                llm_model: Some(llm_model.into_proto()),
            })
            .await?
    };
    response
        .into_inner()
        .llm_model
        .map(LlmModelDto::try_from)
        .transpose()?
        .ok_or_else(|| AppError::internal("Save returned no llm_model"))
}

#[tauri::command]
pub async fn llm_models_delete(state: State<'_, AppState>, id: String) -> AppResult<()> {
    state
        .grpc
        .llm_models()
        .await?
        .delete(llm_models_pb::DeleteLlmModelRequest { id })
        .await?;
    Ok(())
}
