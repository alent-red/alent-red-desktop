use tauri::State;

use crate::commands::dto::info::InfoDto;
use crate::error::AppResult;
use crate::grpc::generated::info as info_pb;
use crate::state::AppState;

#[tauri::command]
pub async fn info_get(state: State<'_, AppState>) -> AppResult<InfoDto> {
    let response = {
        let mut client = state.grpc.info().await?;
        client.get_info(info_pb::GetInfoRequest {}).await?
    };
    InfoDto::try_from(response.into_inner())
}
