use tauri::State;

use crate::commands::dto::preferences::{PreferenceDto, PreferenceInputDto};
use crate::error::AppResult;
use crate::grpc::generated::preferences as preferences_pb;
use crate::state::AppState;

#[tauri::command]
pub async fn preferences_get_all(state: State<'_, AppState>) -> AppResult<Vec<PreferenceDto>> {
    let response = {
        let mut client = state.grpc.preferences().await?;
        client
            .get_all(preferences_pb::GetAllPreferencesRequest {})
            .await?
    };
    response
        .into_inner()
        .preferences
        .into_iter()
        .map(PreferenceDto::try_from)
        .collect()
}

#[tauri::command]
pub async fn preferences_save_many(
    state: State<'_, AppState>,
    preferences: Vec<PreferenceInputDto>,
) -> AppResult<Vec<PreferenceDto>> {
    let request = preferences_pb::SaveManyPreferencesRequest {
        preferences: preferences
            .into_iter()
            .map(PreferenceInputDto::into_proto)
            .collect(),
    };
    let response = {
        let mut client = state.grpc.preferences().await?;
        client.save_many(request).await?
    };
    response
        .into_inner()
        .preferences
        .into_iter()
        .map(PreferenceDto::try_from)
        .collect()
}
