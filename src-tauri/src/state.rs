use crate::core_sidecar::process::CoreProcess;
use crate::grpc::client::GrpcClient;
use crate::streams::registry::StreamRegistry;

#[derive(Debug)]
pub struct AppState {
    pub grpc: GrpcClient,
    pub streams: StreamRegistry,
    pub core_process: CoreProcess,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            grpc: GrpcClient::new(),
            streams: StreamRegistry::new(),
            core_process: CoreProcess::new(),
        }
    }
}

impl Default for AppState {
    fn default() -> Self {
        Self::new()
    }
}
