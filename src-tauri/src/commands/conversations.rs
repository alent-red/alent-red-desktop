use tauri::{AppHandle, Emitter, State};

use crate::commands::dto::conversations::{ConversationDto, ConversationInputDto};
use crate::error::{AppError, AppResult, ErrorCode};
use crate::grpc::generated::conversations as conversations_pb;
use crate::state::AppState;
use crate::streams::spawn::spawn_grpc_stream;

pub const EVENT_CONVERSATION_SAVED: &str = "conversation:saved";
pub const EVENT_CONVERSATION_DELETED: &str = "conversation:deleted";
pub const EVENT_CONVERSATION_STREAM_ERROR: &str = "conversation:stream-error";

#[tauri::command]
pub async fn conversations_get_all(
    state: State<'_, AppState>,
    agent_id: Option<String>,
) -> AppResult<Vec<ConversationDto>> {
    let response = {
        let mut client = state.grpc.conversations().await?;
        client
            .get_all(conversations_pb::GetAllConversationsRequest { agent_id })
            .await?
    };
    response
        .into_inner()
        .conversations
        .into_iter()
        .map(ConversationDto::try_from)
        .collect()
}

#[tauri::command]
pub async fn conversations_get(
    state: State<'_, AppState>,
    id: String,
) -> AppResult<ConversationDto> {
    let response = {
        let mut client = state.grpc.conversations().await?;
        client
            .get(conversations_pb::GetConversationRequest { id })
            .await?
    };
    response
        .into_inner()
        .conversation
        .map(ConversationDto::try_from)
        .transpose()?
        .ok_or_else(|| {
            AppError::new(
                ErrorCode::NotFound,
                Some("Conversation not found".to_string()),
            )
        })
}

#[tauri::command]
pub async fn conversations_save(
    state: State<'_, AppState>,
    id: Option<String>,
    conversation: ConversationInputDto,
) -> AppResult<ConversationDto> {
    let response = {
        let mut client = state.grpc.conversations().await?;
        client
            .save(conversations_pb::SaveConversationRequest {
                id,
                conversation: Some(conversation.into_proto()),
            })
            .await?
    };
    response
        .into_inner()
        .conversation
        .map(ConversationDto::try_from)
        .transpose()?
        .ok_or_else(|| AppError::internal("Save returned no conversation"))
}

#[tauri::command]
pub async fn conversations_delete(state: State<'_, AppState>, id: String) -> AppResult<()> {
    state
        .grpc
        .conversations()
        .await?
        .delete(conversations_pb::DeleteConversationRequest { id })
        .await?;
    Ok(())
}

#[tauri::command]
pub async fn conversations_split(
    state: State<'_, AppState>,
    split_at_message_id: String,
) -> AppResult<ConversationDto> {
    let response = {
        let mut client = state.grpc.conversations().await?;
        client
            .split(conversations_pb::SplitConversationRequest {
                split_at_message_id,
            })
            .await?
    };
    response
        .into_inner()
        .conversation
        .map(ConversationDto::try_from)
        .transpose()?
        .ok_or_else(|| AppError::internal("Split returned no conversation"))
}

#[tauri::command]
pub async fn conversations_pause(state: State<'_, AppState>, id: String) -> AppResult<()> {
    state
        .grpc
        .conversations()
        .await?
        .pause(conversations_pb::PauseConversationRequest { id })
        .await?;
    Ok(())
}

#[tauri::command]
pub async fn conversations_watch_saves_start(
    state: State<'_, AppState>,
    app_handle: AppHandle,
    conversation_id: Option<String>,
) -> AppResult<String> {
    let key = format!(
        "conversations:watch_saves:{}",
        conversation_id.as_deref().unwrap_or("*")
    );
    let request_conversation_id = conversation_id;
    Ok(spawn_grpc_stream(
        &state,
        app_handle,
        key,
        EVENT_CONVERSATION_STREAM_ERROR,
        move |grpc| async move {
            let stream = grpc
                .conversations()
                .await?
                .watch_saves(conversations_pb::WatchConversationSavesRequest {
                    conversation_id: request_conversation_id,
                })
                .await?
                .into_inner();
            Ok(stream)
        },
        |app_handle, response| {
            if let Some(conversation) = response.conversation {
                let dto = ConversationDto::try_from(conversation)?;
                app_handle
                    .emit(EVENT_CONVERSATION_SAVED, dto)
                    .map_err(|error| AppError::internal(format!("Emit failed: {error}")))?;
            }
            Ok(())
        },
    )
    .await)
}

#[tauri::command]
pub async fn conversations_watch_saves_stop(
    state: State<'_, AppState>,
    key: String,
) -> AppResult<bool> {
    Ok(state.streams.cancel(&key).await)
}

#[tauri::command]
pub async fn conversations_watch_deletions_start(
    state: State<'_, AppState>,
    app_handle: AppHandle,
) -> AppResult<String> {
    let key = "conversations:watch_deletions".to_string();
    Ok(spawn_grpc_stream(
        &state,
        app_handle,
        key,
        EVENT_CONVERSATION_STREAM_ERROR,
        |grpc| async move {
            let stream = grpc
                .conversations()
                .await?
                .watch_deletions(conversations_pb::WatchConversationDeletionsRequest {})
                .await?
                .into_inner();
            Ok(stream)
        },
        |app_handle, response| {
            app_handle
                .emit(EVENT_CONVERSATION_DELETED, response.id)
                .map_err(|error| AppError::internal(format!("Emit failed: {error}")))?;
            Ok(())
        },
    )
    .await)
}

#[tauri::command]
pub async fn conversations_watch_deletions_stop(
    state: State<'_, AppState>,
    key: String,
) -> AppResult<bool> {
    Ok(state.streams.cancel(&key).await)
}
