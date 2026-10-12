use tauri::State;

use crate::commands::dto::agents::{AgentDto, AgentInputDto};
use crate::error::{AppError, AppResult, ErrorCode};
use crate::grpc::generated::agents as agents_pb;
use crate::state::AppState;

#[tauri::command]
pub async fn agents_get_all(
    state: State<'_, AppState>,
    llm_model_id: Option<String>,
    brick_id: Option<String>,
) -> AppResult<Vec<AgentDto>> {
    let response = {
        let mut client = state.grpc.agents().await?;
        client
            .get_all(agents_pb::GetAllAgentsRequest {
                llm_model_id,
                brick_id,
            })
            .await?
    };
    response
        .into_inner()
        .agents
        .into_iter()
        .map(AgentDto::try_from)
        .collect()
}

#[tauri::command]
pub async fn agents_get(state: State<'_, AppState>, id: String) -> AppResult<AgentDto> {
    let response = {
        let mut client = state.grpc.agents().await?;
        client.get(agents_pb::GetAgentRequest { id }).await?
    };
    response
        .into_inner()
        .agent
        .map(AgentDto::try_from)
        .transpose()?
        .ok_or_else(|| AppError::new(ErrorCode::NotFound, Some("Agent not found".to_string())))
}

#[tauri::command]
pub async fn agents_save(
    state: State<'_, AppState>,
    id: Option<String>,
    agent: AgentInputDto,
) -> AppResult<AgentDto> {
    let response = {
        let mut client = state.grpc.agents().await?;
        client
            .save(agents_pb::SaveAgentRequest {
                id,
                agent: Some(agent.into_proto()),
            })
            .await?
    };
    response
        .into_inner()
        .agent
        .map(AgentDto::try_from)
        .transpose()?
        .ok_or_else(|| AppError::internal("Save returned no agent"))
}

#[tauri::command]
pub async fn agents_delete(state: State<'_, AppState>, id: String) -> AppResult<()> {
    state
        .grpc
        .agents()
        .await?
        .delete(agents_pb::DeleteAgentRequest { id })
        .await?;
    Ok(())
}
