use std::future::Future;

use futures_util::{Stream, StreamExt};
use tauri::{AppHandle, Emitter};

use crate::error::AppError;
use crate::grpc::client::GrpcClient;
use crate::state::AppState;

// Spawn a tonic streaming RPC as a tokio task that emits Tauri events for
// each item until the stream ends, the channel breaks, or the task is
// aborted via the StreamRegistry.
//
// The deferred-open pattern (opening the stream inside the spawned task)
// is the contract for every streaming RPC because some gRPC servers delay
// HTTP/2 response headers until they have data; opening synchronously
// would block the caller indefinitely.
//
// Errors at every step are surfaced via Tauri events on `error_event` so
// the JS side can observe them and tear down its listeners.
pub async fn spawn_grpc_stream<Item, Open, OpenFuture, Stream_, Emit>(
    state: &AppState,
    app_handle: AppHandle,
    key: String,
    error_event: &'static str,
    open: Open,
    emit: Emit,
) -> String
where
    Open: FnOnce(GrpcClient) -> OpenFuture + Send + 'static,
    OpenFuture: Future<Output = Result<Stream_, AppError>> + Send,
    Stream_: Stream<Item = Result<Item, tonic::Status>> + Send + Unpin + 'static,
    Item: Send + 'static,
    Emit: Fn(&AppHandle, Item) -> Result<(), AppError> + Send + 'static,
{
    let grpc = state.grpc.clone();
    let handle = tokio::spawn(async move {
        let stream = match open(grpc).await {
            Ok(stream) => stream,
            Err(error) => {
                let _ = app_handle.emit(error_event, error);
                return;
            }
        };
        tokio::pin!(stream);
        while let Some(item) = stream.next().await {
            match item {
                Ok(value) => {
                    if let Err(error) = emit(&app_handle, value) {
                        let _ = app_handle.emit(error_event, error);
                        break;
                    }
                }
                Err(status) => {
                    let _ = app_handle.emit(error_event, AppError::from(status));
                    break;
                }
            }
        }
    });
    state.streams.register(key.clone(), handle).await;
    key
}
