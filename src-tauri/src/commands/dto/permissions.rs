use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum PermissionKindDto {
    ScreenRecording,
    Accessibility,
    FullDiskAccess,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(
    tag = "type",
    rename_all = "SCREAMING_SNAKE_CASE",
    rename_all_fields = "camelCase"
)]
pub enum PermissionsStatusDto {
    Macos {
        screen_recording: bool,
        accessibility: bool,
        full_disk_access: bool,
    },
    NotApplicable,
}
