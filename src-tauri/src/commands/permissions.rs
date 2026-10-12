use tauri::AppHandle;

use crate::commands::dto::permissions::{PermissionKindDto, PermissionsStatusDto};
use crate::error::AppResult;

#[tauri::command]
pub async fn permissions_check(app_handle: AppHandle) -> AppResult<PermissionsStatusDto> {
    platform::check(app_handle).await
}

#[tauri::command]
pub async fn permissions_request(kind: PermissionKindDto) -> AppResult<()> {
    platform::request(kind).await
}

#[cfg(target_os = "macos")]
mod platform {
    use tauri::AppHandle;
    use tauri_plugin_macos_permissions::{
        check_accessibility_permission, check_full_disk_access_permission,
        check_screen_recording_permission, request_accessibility_permission,
        request_full_disk_access_permission, request_screen_recording_permission,
    };

    use crate::commands::dto::permissions::{PermissionKindDto, PermissionsStatusDto};
    use crate::error::{AppError, AppResult};

    pub async fn check(app_handle: AppHandle) -> AppResult<PermissionsStatusDto> {
        let screen_recording = check_screen_recording_permission().await;
        let accessibility = check_accessibility_permission().await;
        let full_disk_access = check_full_disk_access_permission(app_handle).await;
        Ok(PermissionsStatusDto::Macos {
            screen_recording,
            accessibility,
            full_disk_access,
        })
    }

    pub async fn request(kind: PermissionKindDto) -> AppResult<()> {
        match kind {
            PermissionKindDto::ScreenRecording => {
                request_screen_recording_permission().await;
                Ok(())
            }
            PermissionKindDto::Accessibility => {
                request_accessibility_permission().await;
                Ok(())
            }
            PermissionKindDto::FullDiskAccess => request_full_disk_access_permission()
                .await
                .map_err(AppError::internal),
        }
    }
}

#[cfg(not(target_os = "macos"))]
mod platform {
    use tauri::AppHandle;

    use crate::commands::dto::permissions::{PermissionKindDto, PermissionsStatusDto};
    use crate::error::AppResult;

    // Stubs must stay async to match the macOS module's signature so the
    // dispatch sites in the parent module can `.await` uniformly.
    #[allow(clippy::unused_async)]
    pub async fn check(_app_handle: AppHandle) -> AppResult<PermissionsStatusDto> {
        Ok(PermissionsStatusDto::NotApplicable)
    }

    #[allow(clippy::unused_async)]
    pub async fn request(_kind: PermissionKindDto) -> AppResult<()> {
        Ok(())
    }
}
