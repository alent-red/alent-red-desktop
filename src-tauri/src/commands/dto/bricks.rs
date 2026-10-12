use serde::{Deserialize, Serialize};

use super::timestamp::convert_timestamp;
use crate::error::AppError;
use crate::grpc::generated::bricks as bricks_pb;

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum BrickConfigUiMovePointerGeometry {
    Point,
    BoundingBox,
}

impl TryFrom<i32> for BrickConfigUiMovePointerGeometry {
    type Error = AppError;

    fn try_from(value: i32) -> Result<Self, Self::Error> {
        let proto_value =
            bricks_pb::BrickConfigUiMovePointerGeometry::try_from(value).map_err(|_| {
                AppError::invalid_response(format!(
                    "Unknown BrickConfigUiMovePointerGeometry variant: {value}"
                ))
            })?;
        match proto_value {
            bricks_pb::BrickConfigUiMovePointerGeometry::Point => Ok(Self::Point),
            bricks_pb::BrickConfigUiMovePointerGeometry::BoundingBox => Ok(Self::BoundingBox),
            bricks_pb::BrickConfigUiMovePointerGeometry::Unspecified => {
                Err(AppError::invalid_response(
                    "BrickConfigUi has unspecified `move_pointer_geometry` field",
                ))
            }
        }
    }
}

impl BrickConfigUiMovePointerGeometry {
    pub const fn into_proto(self) -> bricks_pb::BrickConfigUiMovePointerGeometry {
        match self {
            Self::Point => bricks_pb::BrickConfigUiMovePointerGeometry::Point,
            Self::BoundingBox => bricks_pb::BrickConfigUiMovePointerGeometry::BoundingBox,
        }
    }
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum BrickConfigUiMovePointerCoordinateSpace {
    Pixels,
    Normalized1000,
}

impl TryFrom<i32> for BrickConfigUiMovePointerCoordinateSpace {
    type Error = AppError;

    fn try_from(value: i32) -> Result<Self, Self::Error> {
        let proto_value = bricks_pb::BrickConfigUiMovePointerCoordinateSpace::try_from(value)
            .map_err(|_| {
                AppError::invalid_response(format!(
                    "Unknown BrickConfigUiMovePointerCoordinateSpace variant: {value}"
                ))
            })?;
        match proto_value {
            bricks_pb::BrickConfigUiMovePointerCoordinateSpace::Pixels => Ok(Self::Pixels),
            bricks_pb::BrickConfigUiMovePointerCoordinateSpace::Normalized1000 => {
                Ok(Self::Normalized1000)
            }
            bricks_pb::BrickConfigUiMovePointerCoordinateSpace::Unspecified => {
                Err(AppError::invalid_response(
                    "BrickConfigUi has unspecified `move_pointer_coordinate_space` field",
                ))
            }
        }
    }
}

impl BrickConfigUiMovePointerCoordinateSpace {
    pub const fn into_proto(self) -> bricks_pb::BrickConfigUiMovePointerCoordinateSpace {
        match self {
            Self::Pixels => bricks_pb::BrickConfigUiMovePointerCoordinateSpace::Pixels,
            Self::Normalized1000 => {
                bricks_pb::BrickConfigUiMovePointerCoordinateSpace::Normalized1000
            }
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(
    tag = "type",
    rename_all = "SCREAMING_SNAKE_CASE",
    rename_all_fields = "camelCase"
)]
pub enum BrickConfigDto {
    Ui {
        move_pointer_llm_model_id: String,
        move_pointer_geometry: BrickConfigUiMovePointerGeometry,
        move_pointer_coordinate_space: BrickConfigUiMovePointerCoordinateSpace,
    },
    Code,
    System,
    Scheduler,
    Renderer,
    Browser,
    Agent,
    Custom {
        path: String,
    },
    Vision,
    Skills,
}

impl TryFrom<bricks_pb::BrickConfig> for BrickConfigDto {
    type Error = AppError;

    fn try_from(value: bricks_pb::BrickConfig) -> Result<Self, Self::Error> {
        let config = value.config.ok_or_else(|| {
            AppError::invalid_response("BrickConfig is missing required `config` oneof field")
        })?;
        Ok(match config {
            bricks_pb::brick_config::Config::Ui(inner) => Self::Ui {
                move_pointer_llm_model_id: inner.move_pointer_llm_model_id,
                move_pointer_geometry: BrickConfigUiMovePointerGeometry::try_from(
                    inner.move_pointer_geometry,
                )?,
                move_pointer_coordinate_space: BrickConfigUiMovePointerCoordinateSpace::try_from(
                    inner.move_pointer_coordinate_space,
                )?,
            },
            bricks_pb::brick_config::Config::Code(_) => Self::Code,
            bricks_pb::brick_config::Config::System(_) => Self::System,
            bricks_pb::brick_config::Config::Scheduler(_) => Self::Scheduler,
            bricks_pb::brick_config::Config::Renderer(_) => Self::Renderer,
            bricks_pb::brick_config::Config::Browser(_) => Self::Browser,
            bricks_pb::brick_config::Config::Agent(_) => Self::Agent,
            bricks_pb::brick_config::Config::Custom(inner) => Self::Custom { path: inner.path },
            bricks_pb::brick_config::Config::Vision(_) => Self::Vision,
            bricks_pb::brick_config::Config::Skills(_) => Self::Skills,
        })
    }
}

impl BrickConfigDto {
    pub fn into_proto(self) -> bricks_pb::BrickConfig {
        let config = match self {
            Self::Ui {
                move_pointer_llm_model_id,
                move_pointer_geometry,
                move_pointer_coordinate_space,
            } => bricks_pb::brick_config::Config::Ui(bricks_pb::BrickConfigUi {
                move_pointer_llm_model_id,
                move_pointer_geometry: move_pointer_geometry.into_proto() as i32,
                move_pointer_coordinate_space: move_pointer_coordinate_space.into_proto() as i32,
            }),
            Self::Code => bricks_pb::brick_config::Config::Code(bricks_pb::BrickConfigCode {}),
            Self::System => {
                bricks_pb::brick_config::Config::System(bricks_pb::BrickConfigSystem {})
            }
            Self::Scheduler => {
                bricks_pb::brick_config::Config::Scheduler(bricks_pb::BrickConfigScheduler {})
            }
            Self::Renderer => {
                bricks_pb::brick_config::Config::Renderer(bricks_pb::BrickConfigRenderer {})
            }
            Self::Browser => {
                bricks_pb::brick_config::Config::Browser(bricks_pb::BrickConfigBrowser {})
            }
            Self::Agent => bricks_pb::brick_config::Config::Agent(bricks_pb::BrickConfigAgent {}),
            Self::Custom { path } => {
                bricks_pb::brick_config::Config::Custom(bricks_pb::BrickConfigCustom { path })
            }
            Self::Vision => {
                bricks_pb::brick_config::Config::Vision(bricks_pb::BrickConfigVision {})
            }
            Self::Skills => {
                bricks_pb::brick_config::Config::Skills(bricks_pb::BrickConfigSkills {})
            }
        };
        bricks_pb::BrickConfig {
            config: Some(config),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BrickDto {
    pub id: String,
    pub created_at: String,
    pub updated_at: String,
    pub name: String,
    pub config: BrickConfigDto,
}

impl TryFrom<bricks_pb::Brick> for BrickDto {
    type Error = AppError;

    fn try_from(value: bricks_pb::Brick) -> Result<Self, Self::Error> {
        let config = value.config.ok_or_else(|| {
            AppError::invalid_response("Brick is missing required `config` field")
        })?;
        Ok(Self {
            id: value.id,
            created_at: convert_timestamp("created_at", value.created_at)?,
            updated_at: convert_timestamp("updated_at", value.updated_at)?,
            name: value.name,
            config: BrickConfigDto::try_from(config)?,
        })
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BrickInputDto {
    pub name: String,
    pub config: BrickConfigDto,
}

impl BrickInputDto {
    pub fn into_proto(self) -> bricks_pb::BrickInput {
        bricks_pb::BrickInput {
            name: self.name,
            config: Some(self.config.into_proto()),
        }
    }
}
