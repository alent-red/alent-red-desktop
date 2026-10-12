use serde::{Deserialize, Serialize};

use super::timestamp::convert_timestamp;
use crate::error::AppError;
use crate::grpc::generated::llm_models as llm_models_pb;

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum LlmModelImageDetail {
    Default,
    Low,
    High,
}

impl TryFrom<i32> for LlmModelImageDetail {
    type Error = AppError;

    fn try_from(value: i32) -> Result<Self, Self::Error> {
        let proto_value = llm_models_pb::LlmModelImageDetail::try_from(value).map_err(|_| {
            AppError::invalid_response(format!("Unknown LlmModelImageDetail variant: {value}"))
        })?;
        Ok(match proto_value {
            llm_models_pb::LlmModelImageDetail::Default => Self::Default,
            llm_models_pb::LlmModelImageDetail::Low => Self::Low,
            llm_models_pb::LlmModelImageDetail::High => Self::High,
        })
    }
}

impl LlmModelImageDetail {
    pub const fn into_proto(self) -> llm_models_pb::LlmModelImageDetail {
        match self {
            Self::Default => llm_models_pb::LlmModelImageDetail::Default,
            Self::Low => llm_models_pb::LlmModelImageDetail::Low,
            Self::High => llm_models_pb::LlmModelImageDetail::High,
        }
    }
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum LlmModelCache {
    Default,
    Medium,
    High,
}

impl TryFrom<i32> for LlmModelCache {
    type Error = AppError;

    fn try_from(value: i32) -> Result<Self, Self::Error> {
        let proto_value = llm_models_pb::LlmModelCache::try_from(value).map_err(|_| {
            AppError::invalid_response(format!("Unknown LlmModelCache variant: {value}"))
        })?;
        Ok(match proto_value {
            llm_models_pb::LlmModelCache::Default => Self::Default,
            llm_models_pb::LlmModelCache::Medium => Self::Medium,
            llm_models_pb::LlmModelCache::High => Self::High,
        })
    }
}

impl LlmModelCache {
    pub const fn into_proto(self) -> llm_models_pb::LlmModelCache {
        match self {
            Self::Default => llm_models_pb::LlmModelCache::Default,
            Self::Medium => llm_models_pb::LlmModelCache::Medium,
            Self::High => llm_models_pb::LlmModelCache::High,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LlmModelDto {
    pub id: String,
    pub created_at: String,
    pub updated_at: String,
    pub name: String,
    pub model_id: String,
    pub context_window_tokens_count: i32,
    pub max_output_tokens_count: i32,
    pub top_p: f64,
    pub image_detail: LlmModelImageDetail,
    pub cache: LlmModelCache,
    pub provider_id: String,
}

impl TryFrom<llm_models_pb::LlmModel> for LlmModelDto {
    type Error = AppError;

    fn try_from(value: llm_models_pb::LlmModel) -> Result<Self, Self::Error> {
        Ok(Self {
            id: value.id,
            created_at: convert_timestamp("created_at", value.created_at)?,
            updated_at: convert_timestamp("updated_at", value.updated_at)?,
            name: value.name,
            model_id: value.model_id,
            context_window_tokens_count: value.context_window_tokens_count,
            max_output_tokens_count: value.max_output_tokens_count,
            top_p: value.top_p,
            image_detail: LlmModelImageDetail::try_from(value.image_detail)?,
            cache: LlmModelCache::try_from(value.cache)?,
            provider_id: value.provider_id,
        })
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LlmModelInputDto {
    pub name: String,
    pub model_id: String,
    pub context_window_tokens_count: i32,
    pub max_output_tokens_count: i32,
    pub top_p: f64,
    pub image_detail: LlmModelImageDetail,
    pub cache: LlmModelCache,
    pub provider_id: String,
}

impl LlmModelInputDto {
    pub fn into_proto(self) -> llm_models_pb::LlmModelInput {
        llm_models_pb::LlmModelInput {
            name: self.name,
            model_id: self.model_id,
            context_window_tokens_count: self.context_window_tokens_count,
            max_output_tokens_count: self.max_output_tokens_count,
            top_p: self.top_p,
            image_detail: self.image_detail.into_proto() as i32,
            cache: self.cache.into_proto() as i32,
            provider_id: self.provider_id,
        }
    }
}
