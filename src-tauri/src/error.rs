use std::fmt;

use serde::{Deserialize, Serialize};
use tonic::{metadata::AsciiMetadataValue, Status};

use crate::grpc::generated::common as common_pb;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppError {
    pub code: ErrorCode,
    pub message: Option<String>,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum ErrorCode {
    Unknown,
    Internal,
    InvalidArgument,
    NotSupported,
    NotAllowed,
    NotFound,
    Duplicated,
    RelationViolation,
    RateLimit,
    InvalidResponse,
    Timeout,
    Transport,
}

impl fmt::Display for AppError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match &self.message {
            Some(message) => write!(formatter, "{:?}: {}", self.code, message),
            None => write!(formatter, "{:?}", self.code),
        }
    }
}

impl std::error::Error for AppError {}

impl AppError {
    pub fn new(code: ErrorCode, message: impl Into<Option<String>>) -> Self {
        Self {
            code,
            message: message.into(),
        }
    }

    pub fn transport(message: impl Into<String>) -> Self {
        Self {
            code: ErrorCode::Transport,
            message: Some(message.into()),
        }
    }

    pub fn internal(message: impl Into<String>) -> Self {
        Self {
            code: ErrorCode::Internal,
            message: Some(message.into()),
        }
    }

    pub fn invalid_response(message: impl Into<String>) -> Self {
        Self {
            code: ErrorCode::InvalidResponse,
            message: Some(message.into()),
        }
    }
}

impl From<Status> for AppError {
    fn from(status: Status) -> Self {
        if is_transport_status_code(status.code()) {
            return Self::transport(format!("gRPC {:?}: {}", status.code(), status.message()));
        }
        let metadata = status.metadata();
        let code = read_metadata(metadata, "error-code")
            .map_or(ErrorCode::Unknown, |raw| parse_error_code(&raw));
        let message = read_metadata(metadata, "error-message");
        Self { code, message }
    }
}

const fn is_transport_status_code(code: tonic::Code) -> bool {
    matches!(
        code,
        tonic::Code::Unavailable | tonic::Code::DeadlineExceeded
    )
}

impl From<tonic::transport::Error> for AppError {
    fn from(error: tonic::transport::Error) -> Self {
        Self::transport(error.to_string())
    }
}

fn read_metadata(metadata: &tonic::metadata::MetadataMap, key: &str) -> Option<String> {
    metadata
        .get(key)
        .and_then(|value: &AsciiMetadataValue| value.to_str().ok())
        .map(ToOwned::to_owned)
}

fn parse_error_code(raw: &str) -> ErrorCode {
    match raw {
        "INTERNAL" => ErrorCode::Internal,
        "INVALID_ARGUMENT" => ErrorCode::InvalidArgument,
        "NOT_SUPPORTED" => ErrorCode::NotSupported,
        "NOT_ALLOWED" => ErrorCode::NotAllowed,
        "NOT_FOUND" => ErrorCode::NotFound,
        "DUPLICATED" => ErrorCode::Duplicated,
        "RELATION_VIOLATION" => ErrorCode::RelationViolation,
        "RATE_LIMIT" => ErrorCode::RateLimit,
        "INVALID_RESPONSE" => ErrorCode::InvalidResponse,
        "TIMEOUT" => ErrorCode::Timeout,
        _ => ErrorCode::Unknown,
    }
}

pub fn proto_error_code_to_app(code: i32) -> ErrorCode {
    // Unknown wire variant maps to the explicit Unknown sentinel — this is
    // the defined fallback for ErrorCode itself, not silent data loss.
    match common_pb::ErrorCode::try_from(code).unwrap_or(common_pb::ErrorCode::Unknown) {
        common_pb::ErrorCode::Unknown => ErrorCode::Unknown,
        common_pb::ErrorCode::Internal => ErrorCode::Internal,
        common_pb::ErrorCode::InvalidArgument => ErrorCode::InvalidArgument,
        common_pb::ErrorCode::NotSupported => ErrorCode::NotSupported,
        common_pb::ErrorCode::NotAllowed => ErrorCode::NotAllowed,
        common_pb::ErrorCode::NotFound => ErrorCode::NotFound,
        common_pb::ErrorCode::Duplicated => ErrorCode::Duplicated,
        common_pb::ErrorCode::RelationViolation => ErrorCode::RelationViolation,
        common_pb::ErrorCode::RateLimit => ErrorCode::RateLimit,
        common_pb::ErrorCode::InvalidResponse => ErrorCode::InvalidResponse,
        common_pb::ErrorCode::Timeout => ErrorCode::Timeout,
    }
}

pub type AppResult<T> = Result<T, AppError>;
