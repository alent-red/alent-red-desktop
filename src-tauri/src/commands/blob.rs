use tauri::State;

use crate::commands::dto::blob::{BlobDto, BlobInputDto};
use crate::error::{AppError, AppResult};
use crate::grpc::generated::blob as blob_pb;
use crate::state::AppState;

#[tauri::command]
pub async fn blob_save(state: State<'_, AppState>, blob: BlobInputDto) -> AppResult<String> {
    let proto_blob = blob.into_proto()?;
    let response = {
        let mut client = state.grpc.blobs().await?;
        client
            .save(blob_pb::SaveBlobRequest {
                blob: Some(proto_blob),
            })
            .await?
    };
    Ok(response.into_inner().key)
}

#[tauri::command]
pub async fn blob_read(state: State<'_, AppState>, key: String) -> AppResult<BlobDto> {
    let response = {
        let mut client = state.grpc.blobs().await?;
        client.read(blob_pb::ReadBlobRequest { key }).await?
    };
    response
        .into_inner()
        .blob
        .map(BlobDto::try_from)
        .transpose()?
        .ok_or_else(|| AppError::internal("Read returned no blob"))
}
