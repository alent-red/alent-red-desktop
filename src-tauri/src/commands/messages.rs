use tauri::{AppHandle, Emitter, State};

use crate::commands::dto::messages::{MessageContentUserInputDto, MessageDto};
use crate::error::{AppError, AppResult};
use crate::grpc::generated::messages as messages_pb;
use crate::state::AppState;
use crate::streams::spawn::spawn_grpc_stream;

pub const EVENT_MESSAGE_SAVED: &str = "message:saved";
pub const EVENT_MESSAGE_DELETED_AFTER: &str = "message:deleted-after";
pub const EVENT_MESSAGE_STREAM_ERROR: &str = "message:stream-error";

#[tauri::command]
pub async fn messages_get_all(
    state: State<'_, AppState>,
    conversation_id: String,
    before_message_id: Option<String>,
    count: Option<i32>,
) -> AppResult<Vec<MessageDto>> {
    let response = {
        let mut client = state.grpc.messages().await?;
        client
            .get_all(messages_pb::GetAllMessagesRequest {
                conversation_id,
                before_message_id,
                count,
            })
            .await?
    };
    response
        .into_inner()
        .messages
        .into_iter()
        .map(MessageDto::try_from)
        .collect()
}

#[tauri::command]
pub async fn messages_save(
    state: State<'_, AppState>,
    id: Option<String>,
    message_content_user_input: MessageContentUserInputDto,
) -> AppResult<MessageDto> {
    let response = {
        let mut client = state.grpc.messages().await?;
        client
            .save(messages_pb::SaveMessageRequest {
                id,
                message_content_user_input: Some(message_content_user_input.into_proto()),
            })
            .await?
    };
    response
        .into_inner()
        .message
        .map(MessageDto::try_from)
        .transpose()?
        .ok_or_else(|| AppError::internal("Save returned no message"))
}

#[tauri::command]
pub async fn messages_watch_saves_start(
    state: State<'_, AppState>,
    app_handle: AppHandle,
    conversation_id: String,
) -> AppResult<String> {
    let key = format!("messages:watch_saves:{conversation_id}");
    let stream_conversation_id = conversation_id;
    Ok(spawn_grpc_stream(
        &state,
        app_handle,
        key,
        EVENT_MESSAGE_STREAM_ERROR,
        move |grpc| async move {
            let stream = grpc
                .messages()
                .await?
                .watch_saves(messages_pb::WatchMessageSavesRequest {
                    conversation_id: stream_conversation_id,
                })
                .await?
                .into_inner();
            Ok(stream)
        },
        |app_handle, response| {
            if let Some(message) = response.message {
                let dto = MessageDto::try_from(message)?;
                app_handle
                    .emit(EVENT_MESSAGE_SAVED, dto)
                    .map_err(|error| AppError::internal(format!("Emit failed: {error}")))?;
            }
            Ok(())
        },
    )
    .await)
}

#[tauri::command]
pub async fn messages_watch_saves_stop(state: State<'_, AppState>, key: String) -> AppResult<bool> {
    Ok(state.streams.cancel(&key).await)
}

#[tauri::command]
pub async fn messages_watch_delete_afters_start(
    state: State<'_, AppState>,
    app_handle: AppHandle,
    conversation_id: String,
) -> AppResult<String> {
    let key = format!("messages:watch_delete_afters:{conversation_id}");
    let stream_conversation_id = conversation_id;
    Ok(spawn_grpc_stream(
        &state,
        app_handle,
        key,
        EVENT_MESSAGE_STREAM_ERROR,
        move |grpc| async move {
            let stream = grpc
                .messages()
                .await?
                .watch_delete_afters(messages_pb::WatchMessageDeleteAftersRequest {
                    conversation_id: stream_conversation_id,
                })
                .await?
                .into_inner();
            Ok(stream)
        },
        |app_handle, response| {
            app_handle
                .emit(EVENT_MESSAGE_DELETED_AFTER, response.message_id)
                .map_err(|error| AppError::internal(format!("Emit failed: {error}")))?;
            Ok(())
        },
    )
    .await)
}

#[tauri::command]
pub async fn messages_watch_delete_afters_stop(
    state: State<'_, AppState>,
    key: String,
) -> AppResult<bool> {
    Ok(state.streams.cancel(&key).await)
}
