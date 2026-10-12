use serde::{Deserialize, Serialize};

use super::timestamp::convert_timestamp;
use crate::error::{proto_error_code_to_app, AppError, ErrorCode};
use crate::grpc::generated::conversations as conversations_pb;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConversationSenderDto {
    pub name: Option<String>,
    pub user_name: Option<String>,
    pub picture_file_key: Option<String>,
}

impl TryFrom<conversations_pb::ConversationSender> for ConversationSenderDto {
    type Error = AppError;

    fn try_from(value: conversations_pb::ConversationSender) -> Result<Self, Self::Error> {
        Ok(Self {
            name: value.name,
            user_name: value.user_name,
            picture_file_key: value.picture_file_key,
        })
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConversationDto {
    pub id: String,
    pub created_at: String,
    pub updated_at: String,
    pub name: Option<String>,
    pub processing: bool,
    pub error_code: Option<ErrorCode>,
    pub error_message: Option<String>,
    pub agent_id: Option<String>,
    pub gateway_id: Option<String>,
    pub gateway_external_id: Option<String>,
    pub sender: Option<ConversationSenderDto>,
    pub context_tokens_count: Option<i32>,
}

impl TryFrom<conversations_pb::Conversation> for ConversationDto {
    type Error = AppError;

    fn try_from(value: conversations_pb::Conversation) -> Result<Self, Self::Error> {
        let sender = value
            .sender
            .map(ConversationSenderDto::try_from)
            .transpose()?;
        Ok(Self {
            id: value.id,
            created_at: convert_timestamp("created_at", value.created_at)?,
            updated_at: convert_timestamp("updated_at", value.updated_at)?,
            name: value.name,
            processing: value.processing,
            error_code: value.error_code.map(proto_error_code_to_app),
            error_message: value.error_message,
            agent_id: value.agent_id,
            gateway_id: value.gateway_id,
            gateway_external_id: value.gateway_external_id,
            sender,
            context_tokens_count: value.context_tokens_count,
        })
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConversationInputDto {
    pub name: Option<String>,
    pub agent_id: String,
}

impl ConversationInputDto {
    pub fn into_proto(self) -> conversations_pb::ConversationInput {
        conversations_pb::ConversationInput {
            name: self.name,
            agent_id: self.agent_id,
        }
    }
}
