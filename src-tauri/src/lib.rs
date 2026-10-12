mod commands;
mod core_sidecar;
mod error;
mod grpc;
mod state;
mod streams;

use tauri::{Manager, RunEvent};

use state::AppState;

/// Launches the Tauri application and blocks until it exits.
///
/// # Panics
///
/// Panics if the Tauri builder fails to produce a runnable application —
/// only reachable on a misconfigured bundle (invalid `tauri.conf.json`,
/// missing capabilities, etc.) and treated as a fatal startup error.
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init());

    let builder = install_windows_frame_plugin(builder);
    let app = builder
        .manage(AppState::new())
        .invoke_handler(tauri::generate_handler![
            commands::info::info_get,
            commands::preferences::preferences_get_all,
            commands::preferences::preferences_save_many,
            commands::providers::providers_get_all,
            commands::providers::providers_get,
            commands::providers::providers_save,
            commands::providers::providers_delete,
            commands::llm_models::llm_models_get_all,
            commands::llm_models::llm_models_get,
            commands::llm_models::llm_models_save,
            commands::llm_models::llm_models_delete,
            commands::agents::agents_get_all,
            commands::agents::agents_get,
            commands::agents::agents_save,
            commands::agents::agents_delete,
            commands::bricks::bricks_get_all,
            commands::bricks::bricks_get,
            commands::bricks::bricks_save,
            commands::bricks::bricks_delete,
            commands::gateways::gateways_get_all,
            commands::gateways::gateways_get,
            commands::gateways::gateways_save,
            commands::gateways::gateways_delete,
            commands::conversations::conversations_get_all,
            commands::conversations::conversations_get,
            commands::conversations::conversations_save,
            commands::conversations::conversations_delete,
            commands::conversations::conversations_split,
            commands::conversations::conversations_pause,
            commands::conversations::conversations_watch_saves_start,
            commands::conversations::conversations_watch_saves_stop,
            commands::conversations::conversations_watch_deletions_start,
            commands::conversations::conversations_watch_deletions_stop,
            commands::messages::messages_get_all,
            commands::messages::messages_save,
            commands::messages::messages_watch_saves_start,
            commands::messages::messages_watch_saves_stop,
            commands::messages::messages_watch_delete_afters_start,
            commands::messages::messages_watch_delete_afters_stop,
            commands::transport::transport_connect,
            commands::transport::transport_status,
            commands::blob::blob_save,
            commands::blob::blob_read,
            commands::permissions::permissions_check,
            commands::permissions::permissions_request,
        ])
        .build(tauri::generate_context!())
        .expect("error while building tauri application");

    app.run(|app_handle, event| {
        if matches!(event, RunEvent::Exit) {
            let state = app_handle.state::<AppState>();
            tauri::async_runtime::block_on(state.core_process.shutdown());
        }
    });
}

#[cfg(target_os = "windows")]
fn install_windows_frame_plugin<R: tauri::Runtime>(
    builder: tauri::Builder<R>,
) -> tauri::Builder<R> {
    builder.plugin(
        tauri_plugin_frame::FramePluginBuilder::new()
            .auto_titlebar(true)
            .titlebar_height(40)
            .build(),
    )
}

#[cfg(not(target_os = "windows"))]
const fn install_windows_frame_plugin<R: tauri::Runtime>(
    builder: tauri::Builder<R>,
) -> tauri::Builder<R> {
    builder
}
