use serde::{Deserialize, Serialize};

use super::timestamp::convert_timestamp;
use crate::error::{proto_error_code_to_app, AppError, ErrorCode};
use crate::grpc::generated::gateways as gateways_pb;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(
    tag = "type",
    rename_all = "SCREAMING_SNAKE_CASE",
    rename_all_fields = "camelCase"
)]
pub enum GatewayConfigDto {
    Telegram {
        token: String,
        allow_all: bool,
        allowed_user_names: Vec<String>,
    },
}

impl TryFrom<gateways_pb::GatewayConfig> for GatewayConfigDto {
    type Error = AppError;

    fn try_from(value: gateways_pb::GatewayConfig) -> Result<Self, Self::Error> {
        let config = value.config.ok_or_else(|| {
            AppError::invalid_response("GatewayConfig is missing required `config` oneof field")
        })?;
        Ok(match config {
            gateways_pb::gateway_config::Config::Telegram(inner) => Self::Telegram {
                token: inner.token,
                allow_all: inner.allow_all,
                allowed_user_names: inner.allowed_user_names,
            },
        })
    }
}

impl GatewayConfigDto {
    pub fn into_proto(self) -> gateways_pb::GatewayConfig {
        let config = match self {
            Self::Telegram {
                token,
                allow_all,
                allowed_user_names,
            } => {
                gateways_pb::gateway_config::Config::Telegram(gateways_pb::GatewayConfigTelegram {
                    token,
                    allow_all,
                    allowed_user_names,
                })
            }
        };
        gateways_pb::GatewayConfig {
            config: Some(config),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GatewayDto {
    pub id: String,
    pub created_at: String,
    pub updated_at: String,
    pub name: String,
    pub send_detailed_messages: bool,
    pub config: GatewayConfigDto,
    pub agent_id: String,
    pub error_code: Option<ErrorCode>,
    pub error_message: Option<String>,
}

impl TryFrom<gateways_pb::Gateway> for GatewayDto {
    type Error = AppError;

    fn try_from(value: gateways_pb::Gateway) -> Result<Self, Self::Error> {
        let raw_config = value.config.ok_or_else(|| {
            AppError::invalid_response("Gateway is missing required `config` field")
        })?;
        Ok(Self {
            id: value.id,
            created_at: convert_timestamp("created_at", value.created_at)?,
            updated_at: convert_timestamp("updated_at", value.updated_at)?,
            name: value.name,
            send_detailed_messages: value.send_detailed_messages,
            config: GatewayConfigDto::try_from(raw_config)?,
            agent_id: value.agent_id,
            error_code: value.error_code.map(proto_error_code_to_app),
            error_message: value.error_message,
        })
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GatewayInputDto {
    pub name: String,
    pub send_detailed_messages: bool,
    pub config: GatewayConfigDto,
    pub agent_id: String,
}

impl GatewayInputDto {
    pub fn into_proto(self) -> gateways_pb::GatewayInput {
        gateways_pb::GatewayInput {
            name: self.name,
            send_detailed_messages: self.send_detailed_messages,
            config: Some(self.config.into_proto()),
            agent_id: self.agent_id,
        }
    }
}
