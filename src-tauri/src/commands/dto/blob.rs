use base64::engine::{general_purpose::STANDARD, Engine as _};
use serde::{Deserialize, Serialize};

use crate::error::{AppError, ErrorCode};
use crate::grpc::generated::blob as blob_pb;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BlobDto {
    pub content_base64: String,
    pub content_type: String,
    pub file_name: Option<String>,
}

impl TryFrom<blob_pb::Blob> for BlobDto {
    type Error = AppError;

    fn try_from(value: blob_pb::Blob) -> Result<Self, Self::Error> {
        Ok(Self {
            content_base64: STANDARD.encode(value.content),
            content_type: value.content_type,
            file_name: value.file_name,
        })
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BlobInputDto {
    pub content_base64: String,
    pub content_type: String,
    pub file_name: Option<String>,
}

impl BlobInputDto {
    pub fn into_proto(self) -> Result<blob_pb::Blob, AppError> {
        let content = STANDARD.decode(&self.content_base64).map_err(|error| {
            AppError::new(
                ErrorCode::InvalidArgument,
                Some(format!("Invalid base64 content: {error}")),
            )
        })?;
        Ok(blob_pb::Blob {
            content,
            content_type: self.content_type,
            file_name: self.file_name,
        })
    }
}
