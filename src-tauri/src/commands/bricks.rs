use tauri::State;

use crate::commands::dto::bricks::{BrickDto, BrickInputDto};
use crate::error::{AppError, AppResult, ErrorCode};
use crate::grpc::generated::bricks as bricks_pb;
use crate::state::AppState;

#[tauri::command]
pub async fn bricks_get_all(
    state: State<'_, AppState>,
    agent_id: Option<String>,
) -> AppResult<Vec<BrickDto>> {
    let response = {
        let mut client = state.grpc.bricks().await?;
        client
            .get_all(bricks_pb::GetAllBricksRequest { agent_id })
            .await?
    };
    response
        .into_inner()
        .bricks
        .into_iter()
        .map(BrickDto::try_from)
        .collect()
}

#[tauri::command]
pub async fn bricks_get(state: State<'_, AppState>, id: String) -> AppResult<BrickDto> {
    let response = {
        let mut client = state.grpc.bricks().await?;
        client.get(bricks_pb::GetBrickRequest { id }).await?
    };
    response
        .into_inner()
        .brick
        .map(BrickDto::try_from)
        .transpose()?
        .ok_or_else(|| AppError::new(ErrorCode::NotFound, Some("Brick not found".to_string())))
}

#[tauri::command]
pub async fn bricks_save(
    state: State<'_, AppState>,
    id: Option<String>,
    brick: BrickInputDto,
) -> AppResult<BrickDto> {
    let response = {
        let mut client = state.grpc.bricks().await?;
        client
            .save(bricks_pb::SaveBrickRequest {
                id,
                brick: Some(brick.into_proto()),
            })
            .await?
    };
    response
        .into_inner()
        .brick
        .map(BrickDto::try_from)
        .transpose()?
        .ok_or_else(|| AppError::internal("Save returned no brick"))
}

#[tauri::command]
pub async fn bricks_delete(state: State<'_, AppState>, id: String) -> AppResult<()> {
    state
        .grpc
        .bricks()
        .await?
        .delete(bricks_pb::DeleteBrickRequest { id })
        .await?;
    Ok(())
}
