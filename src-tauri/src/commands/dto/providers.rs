use serde::{Deserialize, Serialize};

use super::timestamp::convert_timestamp;
use crate::error::AppError;
use crate::grpc::generated::providers as providers_pb;

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum AnthropicCacheTtl {
    Default,
    Min5,
    Hour1,
}

impl TryFrom<i32> for AnthropicCacheTtl {
    type Error = AppError;

    fn try_from(value: i32) -> Result<Self, Self::Error> {
        let proto_value = providers_pb::ProviderApiFormatAnthropicCacheTtl::try_from(value)
            .map_err(|_| {
                AppError::invalid_response(format!("Unknown AnthropicCacheTtl variant: {value}"))
            })?;
        Ok(match proto_value {
            providers_pb::ProviderApiFormatAnthropicCacheTtl::Default => Self::Default,
            providers_pb::ProviderApiFormatAnthropicCacheTtl::Min5 => Self::Min5,
            providers_pb::ProviderApiFormatAnthropicCacheTtl::Hour1 => Self::Hour1,
        })
    }
}

impl AnthropicCacheTtl {
    pub const fn into_proto(self) -> providers_pb::ProviderApiFormatAnthropicCacheTtl {
        match self {
            Self::Default => providers_pb::ProviderApiFormatAnthropicCacheTtl::Default,
            Self::Min5 => providers_pb::ProviderApiFormatAnthropicCacheTtl::Min5,
            Self::Hour1 => providers_pb::ProviderApiFormatAnthropicCacheTtl::Hour1,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(
    tag = "type",
    rename_all = "SCREAMING_SNAKE_CASE",
    rename_all_fields = "camelCase"
)]
pub enum ProviderApiFormatDto {
    Anthropic {
        reasoning_minimal_budget_tokens: i32,
        reasoning_low_budget_tokens: i32,
        reasoning_medium_budget_tokens: i32,
        reasoning_high_budget_tokens: i32,
        reasoning_xhigh_budget_tokens: i32,
        cache_medium_ttl: AnthropicCacheTtl,
        cache_high_ttl: AnthropicCacheTtl,
    },
    OpenaiChatCompletions,
    OpenaiResponses,
}

impl TryFrom<providers_pb::ProviderApiFormat> for ProviderApiFormatDto {
    type Error = AppError;

    fn try_from(value: providers_pb::ProviderApiFormat) -> Result<Self, Self::Error> {
        let format = value.format.ok_or_else(|| {
            AppError::invalid_response("ProviderApiFormat is missing required `format` oneof field")
        })?;
        Ok(match format {
            providers_pb::provider_api_format::Format::Anthropic(inner) => Self::Anthropic {
                reasoning_minimal_budget_tokens: inner.reasoning_minimal_budget_tokens,
                reasoning_low_budget_tokens: inner.reasoning_low_budget_tokens,
                reasoning_medium_budget_tokens: inner.reasoning_medium_budget_tokens,
                reasoning_high_budget_tokens: inner.reasoning_high_budget_tokens,
                reasoning_xhigh_budget_tokens: inner.reasoning_xhigh_budget_tokens,
                cache_medium_ttl: AnthropicCacheTtl::try_from(inner.cache_medium_ttl)?,
                cache_high_ttl: AnthropicCacheTtl::try_from(inner.cache_high_ttl)?,
            },
            providers_pb::provider_api_format::Format::OpenaiChatCompletions(_) => {
                Self::OpenaiChatCompletions
            }
            providers_pb::provider_api_format::Format::OpenaiResponses(_) => Self::OpenaiResponses,
        })
    }
}

impl ProviderApiFormatDto {
    pub const fn into_proto(self) -> providers_pb::ProviderApiFormat {
        let format = match self {
            Self::Anthropic {
                reasoning_minimal_budget_tokens,
                reasoning_low_budget_tokens,
                reasoning_medium_budget_tokens,
                reasoning_high_budget_tokens,
                reasoning_xhigh_budget_tokens,
                cache_medium_ttl,
                cache_high_ttl,
            } => providers_pb::provider_api_format::Format::Anthropic(
                providers_pb::ProviderApiFormatAnthropic {
                    reasoning_minimal_budget_tokens,
                    reasoning_low_budget_tokens,
                    reasoning_medium_budget_tokens,
                    reasoning_high_budget_tokens,
                    reasoning_xhigh_budget_tokens,
                    cache_medium_ttl: cache_medium_ttl.into_proto() as i32,
                    cache_high_ttl: cache_high_ttl.into_proto() as i32,
                },
            ),
            Self::OpenaiChatCompletions => {
                providers_pb::provider_api_format::Format::OpenaiChatCompletions(
                    providers_pb::ProviderApiFormatOpenAiChatCompletions {},
                )
            }
            Self::OpenaiResponses => providers_pb::provider_api_format::Format::OpenaiResponses(
                providers_pb::ProviderApiFormatOpenAiResponses {},
            ),
        };
        providers_pb::ProviderApiFormat {
            format: Some(format),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(
    tag = "type",
    rename_all = "SCREAMING_SNAKE_CASE",
    rename_all_fields = "camelCase"
)]
pub enum ProviderConfigDto {
    Anthropic {
        api_key: String,
    },
    Openai {
        api_key: String,
    },
    LmStudio {
        base_url: String,
    },
    Custom {
        base_url: String,
        api_key: Option<String>,
        api_format: ProviderApiFormatDto,
    },
}

impl TryFrom<providers_pb::ProviderConfig> for ProviderConfigDto {
    type Error = AppError;

    fn try_from(value: providers_pb::ProviderConfig) -> Result<Self, Self::Error> {
        let config = value.config.ok_or_else(|| {
            AppError::invalid_response("ProviderConfig is missing required `config` oneof field")
        })?;
        Ok(match config {
            providers_pb::provider_config::Config::Anthropic(inner) => Self::Anthropic {
                api_key: inner.api_key,
            },
            providers_pb::provider_config::Config::Openai(inner) => Self::Openai {
                api_key: inner.api_key,
            },
            providers_pb::provider_config::Config::LmStudio(inner) => Self::LmStudio {
                base_url: inner.base_url,
            },
            providers_pb::provider_config::Config::Custom(inner) => {
                let api_format_proto = inner.api_format.ok_or_else(|| {
                    AppError::invalid_response(
                        "Custom provider config is missing required `api_format` field",
                    )
                })?;
                Self::Custom {
                    base_url: inner.base_url,
                    api_key: inner.api_key,
                    api_format: ProviderApiFormatDto::try_from(api_format_proto)?,
                }
            }
        })
    }
}

impl ProviderConfigDto {
    pub fn into_proto(self) -> providers_pb::ProviderConfig {
        let config =
            match self {
                Self::Anthropic { api_key } => providers_pb::provider_config::Config::Anthropic(
                    providers_pb::ProviderConfigAnthropic { api_key },
                ),
                Self::Openai { api_key } => providers_pb::provider_config::Config::Openai(
                    providers_pb::ProviderConfigOpenAi { api_key },
                ),
                Self::LmStudio { base_url } => providers_pb::provider_config::Config::LmStudio(
                    providers_pb::ProviderConfigLmStudio { base_url },
                ),
                Self::Custom {
                    base_url,
                    api_key,
                    api_format,
                } => providers_pb::provider_config::Config::Custom(
                    providers_pb::ProviderConfigCustom {
                        base_url,
                        api_key,
                        api_format: Some(api_format.into_proto()),
                    },
                ),
            };
        providers_pb::ProviderConfig {
            config: Some(config),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProviderDto {
    pub id: String,
    pub created_at: String,
    pub updated_at: String,
    pub name: String,
    pub config: ProviderConfigDto,
}

impl TryFrom<providers_pb::Provider> for ProviderDto {
    type Error = AppError;

    fn try_from(value: providers_pb::Provider) -> Result<Self, Self::Error> {
        let raw_config = value.config.ok_or_else(|| {
            AppError::invalid_response("Provider is missing required `config` field")
        })?;
        Ok(Self {
            id: value.id,
            created_at: convert_timestamp("created_at", value.created_at)?,
            updated_at: convert_timestamp("updated_at", value.updated_at)?,
            name: value.name,
            config: ProviderConfigDto::try_from(raw_config)?,
        })
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProviderInputDto {
    pub name: String,
    pub config: ProviderConfigDto,
}

impl ProviderInputDto {
    pub fn into_proto(self) -> providers_pb::ProviderInput {
        providers_pb::ProviderInput {
            name: self.name,
            config: Some(self.config.into_proto()),
        }
    }
}
