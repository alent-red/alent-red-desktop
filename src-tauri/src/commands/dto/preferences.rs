use serde::{Deserialize, Serialize};

use super::timestamp::convert_timestamp;
use crate::error::AppError;
use crate::grpc::generated::preferences as preferences_pb;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum PreferenceKey {
    SystemPrompt,
    AgentPromptPlaceholder,
    BrickPromptPlaceholder,
    AttachedFilePathPromptPrefix,
    BrickPromptSeparator,
    BrickToolNameSeparator,
    AttachedFilePathPromptSeparator,
    NoToolResponsePrompt,
    OpenAiBaseUrl,
    AnthropicBaseUrl,
    AnthropicReasoningMinimalBudgetTokens,
    AnthropicReasoningLowBudgetTokens,
    AnthropicReasoningMediumBudgetTokens,
    AnthropicReasoningHighBudgetTokens,
    AnthropicReasoningXhighBudgetTokens,
    AnthropicCacheMediumTtl,
    AnthropicCacheHighTtl,
    LlmStream,
    Unspecified,
}

impl TryFrom<i32> for PreferenceKey {
    type Error = AppError;

    fn try_from(value: i32) -> Result<Self, Self::Error> {
        let proto_key = preferences_pb::PreferenceKey::try_from(value).map_err(|_| {
            AppError::invalid_response(format!("Unknown PreferenceKey variant: {value}"))
        })?;
        Ok(match proto_key {
            preferences_pb::PreferenceKey::SystemPrompt => Self::SystemPrompt,
            preferences_pb::PreferenceKey::AgentPromptPlaceholder => Self::AgentPromptPlaceholder,
            preferences_pb::PreferenceKey::BrickPromptPlaceholder => Self::BrickPromptPlaceholder,
            preferences_pb::PreferenceKey::AttachedFilePathPromptPrefix => {
                Self::AttachedFilePathPromptPrefix
            }
            preferences_pb::PreferenceKey::BrickPromptSeparator => Self::BrickPromptSeparator,
            preferences_pb::PreferenceKey::BrickToolNameSeparator => Self::BrickToolNameSeparator,
            preferences_pb::PreferenceKey::AttachedFilePathPromptSeparator => {
                Self::AttachedFilePathPromptSeparator
            }
            preferences_pb::PreferenceKey::NoToolResponsePrompt => Self::NoToolResponsePrompt,
            preferences_pb::PreferenceKey::OpenAiBaseUrl => Self::OpenAiBaseUrl,
            preferences_pb::PreferenceKey::AnthropicBaseUrl => Self::AnthropicBaseUrl,
            preferences_pb::PreferenceKey::AnthropicReasoningMinimalBudgetTokens => {
                Self::AnthropicReasoningMinimalBudgetTokens
            }
            preferences_pb::PreferenceKey::AnthropicReasoningLowBudgetTokens => {
                Self::AnthropicReasoningLowBudgetTokens
            }
            preferences_pb::PreferenceKey::AnthropicReasoningMediumBudgetTokens => {
                Self::AnthropicReasoningMediumBudgetTokens
            }
            preferences_pb::PreferenceKey::AnthropicReasoningHighBudgetTokens => {
                Self::AnthropicReasoningHighBudgetTokens
            }
            preferences_pb::PreferenceKey::AnthropicReasoningXhighBudgetTokens => {
                Self::AnthropicReasoningXhighBudgetTokens
            }
            preferences_pb::PreferenceKey::AnthropicCacheMediumTtl => Self::AnthropicCacheMediumTtl,
            preferences_pb::PreferenceKey::AnthropicCacheHighTtl => Self::AnthropicCacheHighTtl,
            preferences_pb::PreferenceKey::LlmStream => Self::LlmStream,
            preferences_pb::PreferenceKey::Unspecified => Self::Unspecified,
        })
    }
}

impl PreferenceKey {
    pub const fn into_proto(self) -> preferences_pb::PreferenceKey {
        match self {
            Self::SystemPrompt => preferences_pb::PreferenceKey::SystemPrompt,
            Self::AgentPromptPlaceholder => preferences_pb::PreferenceKey::AgentPromptPlaceholder,
            Self::BrickPromptPlaceholder => preferences_pb::PreferenceKey::BrickPromptPlaceholder,
            Self::AttachedFilePathPromptPrefix => {
                preferences_pb::PreferenceKey::AttachedFilePathPromptPrefix
            }
            Self::BrickPromptSeparator => preferences_pb::PreferenceKey::BrickPromptSeparator,
            Self::BrickToolNameSeparator => preferences_pb::PreferenceKey::BrickToolNameSeparator,
            Self::AttachedFilePathPromptSeparator => {
                preferences_pb::PreferenceKey::AttachedFilePathPromptSeparator
            }
            Self::NoToolResponsePrompt => preferences_pb::PreferenceKey::NoToolResponsePrompt,
            Self::OpenAiBaseUrl => preferences_pb::PreferenceKey::OpenAiBaseUrl,
            Self::AnthropicBaseUrl => preferences_pb::PreferenceKey::AnthropicBaseUrl,
            Self::AnthropicReasoningMinimalBudgetTokens => {
                preferences_pb::PreferenceKey::AnthropicReasoningMinimalBudgetTokens
            }
            Self::AnthropicReasoningLowBudgetTokens => {
                preferences_pb::PreferenceKey::AnthropicReasoningLowBudgetTokens
            }
            Self::AnthropicReasoningMediumBudgetTokens => {
                preferences_pb::PreferenceKey::AnthropicReasoningMediumBudgetTokens
            }
            Self::AnthropicReasoningHighBudgetTokens => {
                preferences_pb::PreferenceKey::AnthropicReasoningHighBudgetTokens
            }
            Self::AnthropicReasoningXhighBudgetTokens => {
                preferences_pb::PreferenceKey::AnthropicReasoningXhighBudgetTokens
            }
            Self::AnthropicCacheMediumTtl => preferences_pb::PreferenceKey::AnthropicCacheMediumTtl,
            Self::AnthropicCacheHighTtl => preferences_pb::PreferenceKey::AnthropicCacheHighTtl,
            Self::LlmStream => preferences_pb::PreferenceKey::LlmStream,
            Self::Unspecified => preferences_pb::PreferenceKey::Unspecified,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum PreferenceValueDto {
    String { value: String },
    Int { value: i64 },
    Float { value: f64 },
    Bool { value: bool },
}

impl TryFrom<preferences_pb::PreferenceValue> for PreferenceValueDto {
    type Error = AppError;

    fn try_from(value: preferences_pb::PreferenceValue) -> Result<Self, Self::Error> {
        let inner = value.value.ok_or_else(|| {
            AppError::invalid_response("PreferenceValue is missing required `value` oneof field")
        })?;
        Ok(match inner {
            preferences_pb::preference_value::Value::StringValue(inner_value) => Self::String {
                value: inner_value.value,
            },
            preferences_pb::preference_value::Value::IntValue(inner_value) => Self::Int {
                value: inner_value.value,
            },
            preferences_pb::preference_value::Value::FloatValue(inner_value) => Self::Float {
                value: inner_value.value,
            },
            preferences_pb::preference_value::Value::BoolValue(inner_value) => Self::Bool {
                value: inner_value.value,
            },
        })
    }
}

impl PreferenceValueDto {
    pub fn into_proto(self) -> preferences_pb::PreferenceValue {
        let value = match self {
            Self::String { value } => preferences_pb::preference_value::Value::StringValue(
                preferences_pb::PreferenceValueString { value },
            ),
            Self::Int { value } => preferences_pb::preference_value::Value::IntValue(
                preferences_pb::PreferenceValueInt { value },
            ),
            Self::Float { value } => preferences_pb::preference_value::Value::FloatValue(
                preferences_pb::PreferenceValueFloat { value },
            ),
            Self::Bool { value } => preferences_pb::preference_value::Value::BoolValue(
                preferences_pb::PreferenceValueBool { value },
            ),
        };
        preferences_pb::PreferenceValue { value: Some(value) }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PreferenceDto {
    pub id: String,
    pub created_at: String,
    pub updated_at: String,
    pub key: PreferenceKey,
    pub value: PreferenceValueDto,
}

impl TryFrom<preferences_pb::Preference> for PreferenceDto {
    type Error = AppError;

    fn try_from(value: preferences_pb::Preference) -> Result<Self, Self::Error> {
        let preference_value = value.value.ok_or_else(|| {
            AppError::invalid_response("Preference is missing required `value` field")
        })?;
        Ok(Self {
            id: value.id,
            created_at: convert_timestamp("created_at", value.created_at)?,
            updated_at: convert_timestamp("updated_at", value.updated_at)?,
            key: PreferenceKey::try_from(value.key)?,
            value: PreferenceValueDto::try_from(preference_value)?,
        })
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PreferenceInputDto {
    pub key: PreferenceKey,
    pub value: PreferenceValueDto,
}

impl PreferenceInputDto {
    pub fn into_proto(self) -> preferences_pb::PreferenceInput {
        preferences_pb::PreferenceInput {
            key: self.key.into_proto() as i32,
            value: Some(self.value.into_proto()),
        }
    }
}
