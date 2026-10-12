use std::fs;
use std::path::PathBuf;

use tauri::{AppHandle, Manager};

use crate::error::{AppError, AppResult};

const CORE_SUBDIR: &str = "core";
const DATABASE_FILE: &str = "database.db";
const BLOB_SUBDIR: &str = "blob";

#[derive(Debug, Clone)]
pub(crate) struct CorePaths {
    pub sqlite_path: PathBuf,
    pub blob_path: PathBuf,
}

pub(crate) fn resolve_and_ensure_core_paths(app_handle: &AppHandle) -> AppResult<CorePaths> {
    let core_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|error| AppError::internal(format!("Failed to resolve app data dir: {error}")))?
        .join(CORE_SUBDIR);

    fs::create_dir_all(&core_dir).map_err(|error| {
        AppError::internal(format!(
            "Failed to create core data dir at {}: {error}",
            core_dir.display()
        ))
    })?;

    let blob_path = core_dir.join(BLOB_SUBDIR);
    fs::create_dir_all(&blob_path).map_err(|error| {
        AppError::internal(format!(
            "Failed to create blob dir at {}: {error}",
            blob_path.display()
        ))
    })?;

    Ok(CorePaths {
        sqlite_path: core_dir.join(DATABASE_FILE),
        blob_path,
    })
}
