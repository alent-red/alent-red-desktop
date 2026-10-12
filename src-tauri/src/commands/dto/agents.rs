use serde::{Deserialize, Serialize};

use super::timestamp::convert_timestamp;
use crate::error::AppError;
use crate::grpc::generated::agents as agents_pb;

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum AgentReasoning {
    Default,
    Minimal,
    Low,
    Medium,
    High,
    Xhigh,
}

impl TryFrom<i32> for AgentReasoning {
    type Error = AppError;

    fn try_from(value: i32) -> Result<Self, Self::Error> {
        let proto_value = agents_pb::AgentReasoning::try_from(value).map_err(|_| {
            AppError::invalid_response(format!("Unknown AgentReasoning variant: {value}"))
        })?;
        Ok(match proto_value {
            agents_pb::AgentReasoning::Default => Self::Default,
            agents_pb::AgentReasoning::Minimal => Self::Minimal,
            agents_pb::AgentReasoning::Low => Self::Low,
            agents_pb::AgentReasoning::Medium => Self::Medium,
            agents_pb::AgentReasoning::High => Self::High,
            agents_pb::AgentReasoning::Xhigh => Self::Xhigh,
        })
    }
}

impl AgentReasoning {
    pub const fn into_proto(self) -> agents_pb::AgentReasoning {
        match self {
            Self::Default => agents_pb::AgentReasoning::Default,
            Self::Minimal => agents_pb::AgentReasoning::Minimal,
            Self::Low => agents_pb::AgentReasoning::Low,
            Self::Medium => agents_pb::AgentReasoning::Medium,
            Self::High => agents_pb::AgentReasoning::High,
            Self::Xhigh => agents_pb::AgentReasoning::Xhigh,
        }
    }
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum AgentVerbosity {
    Default,
    Low,
    Medium,
    High,
}

impl TryFrom<i32> for AgentVerbosity {
    type Error = AppError;

    fn try_from(value: i32) -> Result<Self, Self::Error> {
        let proto_value = agents_pb::AgentVerbosity::try_from(value).map_err(|_| {
            AppError::invalid_response(format!("Unknown AgentVerbosity variant: {value}"))
        })?;
        Ok(match proto_value {
            agents_pb::AgentVerbosity::Default => Self::Default,
            agents_pb::AgentVerbosity::Low => Self::Low,
            agents_pb::AgentVerbosity::Medium => Self::Medium,
            agents_pb::AgentVerbosity::High => Self::High,
        })
    }
}

impl AgentVerbosity {
    pub const fn into_proto(self) -> agents_pb::AgentVerbosity {
        match self {
            Self::Default => agents_pb::AgentVerbosity::Default,
            Self::Low => agents_pb::AgentVerbosity::Low,
            Self::Medium => agents_pb::AgentVerbosity::Medium,
            Self::High => agents_pb::AgentVerbosity::High,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AgentDto {
    pub id: String,
    pub created_at: String,
    pub updated_at: String,
    pub name: String,
    pub picture_file_key: Option<String>,
    pub prompt: Option<String>,
    pub reasoning: AgentReasoning,
    pub verbosity: AgentVerbosity,
    pub llm_model_id: Option<String>,
    pub attached_file_paths: Vec<String>,
}

impl TryFrom<agents_pb::Agent> for AgentDto {
    type Error = AppError;

    fn try_from(value: agents_pb::Agent) -> Result<Self, Self::Error> {
        Ok(Self {
            id: value.id,
            created_at: convert_timestamp("created_at", value.created_at)?,
            updated_at: convert_timestamp("updated_at", value.updated_at)?,
            name: value.name,
            picture_file_key: value.picture_file_key,
            prompt: value.prompt,
            reasoning: AgentReasoning::try_from(value.reasoning)?,
            verbosity: AgentVerbosity::try_from(value.verbosity)?,
            llm_model_id: value.llm_model_id,
            attached_file_paths: value.attached_file_paths,
        })
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AgentInputDto {
    pub name: String,
    pub picture_file_key: Option<String>,
    pub prompt: Option<String>,
    pub reasoning: AgentReasoning,
    pub verbosity: AgentVerbosity,
    pub llm_model_id: String,
    pub brick_ids: Vec<String>,
    pub attached_file_paths: Vec<String>,
}

impl AgentInputDto {
    pub fn into_proto(self) -> agents_pb::AgentInput {
        agents_pb::AgentInput {
            name: self.name,
            picture_file_key: self.picture_file_key,
            prompt: self.prompt,
            reasoning: self.reasoning.into_proto() as i32,
            verbosity: self.verbosity.into_proto() as i32,
            llm_model_id: self.llm_model_id,
            brick_ids: self.brick_ids,
            attached_file_paths: self.attached_file_paths,
        }
    }
}
