use serde::{Deserialize, Serialize};

use crate::error::AppError;
use crate::grpc::generated::info as info_pb;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InfoDto {
    pub version: String,
    pub pid: i32,
}

impl TryFrom<info_pb::GetInfoResponse> for InfoDto {
    type Error = AppError;

    fn try_from(value: info_pb::GetInfoResponse) -> Result<Self, Self::Error> {
        Ok(Self {
            version: value.version,
            pid: value.pid,
        })
    }
}
