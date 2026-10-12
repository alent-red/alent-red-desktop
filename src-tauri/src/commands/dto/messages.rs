use serde::{Deserialize, Serialize};

use super::timestamp::convert_timestamp;
use crate::error::{proto_error_code_to_app, AppError, ErrorCode};
use crate::grpc::generated::messages as messages_pb;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MessageContentToolResponseDto {
    pub text: Option<String>,
    pub image_file_keys: Vec<String>,
}

impl TryFrom<messages_pb::MessageContentToolResponse> for MessageContentToolResponseDto {
    type Error = AppError;

    fn try_from(value: messages_pb::MessageContentToolResponse) -> Result<Self, Self::Error> {
        Ok(Self {
            text: value.text,
            image_file_keys: value.image_file_keys,
        })
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(
    tag = "type",
    rename_all = "SCREAMING_SNAKE_CASE",
    rename_all_fields = "camelCase"
)]
pub enum MessageContentDto {
    Internal {
        text: String,
    },
    User {
        text: String,
        attached_file_paths: Vec<String>,
    },
    Ai {
        text: String,
    },
    Tool {
        name: String,
        processing: bool,
        error: Option<ErrorCode>,
        request: String,
        response: Option<MessageContentToolResponseDto>,
    },
}

impl TryFrom<messages_pb::MessageContent> for MessageContentDto {
    type Error = AppError;

    fn try_from(value: messages_pb::MessageContent) -> Result<Self, Self::Error> {
        let content = value.content.ok_or_else(|| {
            AppError::invalid_response("MessageContent is missing required `content` oneof field")
        })?;
        Ok(match content {
            messages_pb::message_content::Content::Internal(inner) => {
                Self::Internal { text: inner.text }
            }
            messages_pb::message_content::Content::User(inner) => Self::User {
                text: inner.text,
                attached_file_paths: inner.attached_file_paths,
            },
            messages_pb::message_content::Content::Ai(inner) => Self::Ai { text: inner.text },
            messages_pb::message_content::Content::Tool(inner) => {
                let response = inner
                    .response
                    .map(MessageContentToolResponseDto::try_from)
                    .transpose()?;
                Self::Tool {
                    name: inner.name,
                    processing: inner.processing,
                    error: inner.error.map(proto_error_code_to_app),
                    request: inner.request,
                    response,
                }
            }
        })
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MessageDto {
    pub id: String,
    pub created_at: String,
    pub updated_at: String,
    pub content: MessageContentDto,
    pub conversation_id: String,
}

impl TryFrom<messages_pb::Message> for MessageDto {
    type Error = AppError;

    fn try_from(value: messages_pb::Message) -> Result<Self, Self::Error> {
        let content = value.content.ok_or_else(|| {
            AppError::invalid_response("Message is missing required `content` field")
        })?;
        Ok(Self {
            id: value.id,
            created_at: convert_timestamp("created_at", value.created_at)?,
            updated_at: convert_timestamp("updated_at", value.updated_at)?,
            content: MessageContentDto::try_from(content)?,
            conversation_id: value.conversation_id,
        })
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MessageContentUserInputDto {
    pub text: String,
    pub attached_file_paths: Vec<String>,
    pub conversation_id: String,
}

impl MessageContentUserInputDto {
    pub fn into_proto(self) -> messages_pb::MessageContentUserInput {
        messages_pb::MessageContentUserInput {
            text: self.text,
            attached_file_paths: self.attached_file_paths,
            conversation_id: self.conversation_id,
        }
    }
}
