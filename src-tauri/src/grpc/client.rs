use std::sync::Arc;
use std::time::Duration;

use tokio::sync::RwLock;
use tonic::transport::{Channel, Endpoint};

use crate::error::{AppError, AppResult};

use super::generated::{
    agents::agents_client::AgentsClient, blob::blobs_client::BlobsClient,
    bricks::bricks_client::BricksClient, conversations::conversations_client::ConversationsClient,
    gateways::gateways_client::GatewaysClient, info::info_client::InfoClient,
    llm_models::llm_models_client::LlmModelsClient, messages::messages_client::MessagesClient,
    preferences::preferences_client::PreferencesClient,
    providers::providers_client::ProvidersClient,
};

pub const DEFAULT_HOST: &str = "127.0.0.1";
pub const DEFAULT_PORT: u16 = 50051;

const GRPC_CONNECT_TIMEOUT: Duration = Duration::from_secs(3);

#[derive(Clone)]
pub struct GrpcClient {
    inner: Arc<RwLock<Option<Channel>>>,
    endpoint: Arc<RwLock<String>>,
}

impl std::fmt::Debug for GrpcClient {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        formatter.debug_struct("GrpcClient").finish_non_exhaustive()
    }
}

impl GrpcClient {
    pub fn new() -> Self {
        let default = format!("http://{DEFAULT_HOST}:{DEFAULT_PORT}");
        Self {
            inner: Arc::new(RwLock::new(None)),
            endpoint: Arc::new(RwLock::new(default)),
        }
    }

    pub async fn set_endpoint(&self, endpoint: String) -> AppResult<()> {
        {
            let mut guard = self.endpoint.write().await;
            *guard = endpoint;
        }
        self.disconnect().await;
        Ok(())
    }

    pub async fn connect(&self) -> AppResult<Channel> {
        let cached = self.inner.read().await.clone();
        if let Some(channel) = cached {
            return Ok(channel);
        }
        self.open_channel().await
    }

    pub async fn reconnect(&self) -> AppResult<Channel> {
        self.disconnect().await;
        self.open_channel().await
    }

    async fn open_channel(&self) -> AppResult<Channel> {
        let endpoint_url = self.endpoint.read().await.clone();
        let endpoint = Endpoint::from_shared(endpoint_url.clone())
            .map_err(|error| {
                AppError::transport(format!("invalid endpoint {endpoint_url}: {error}"))
            })?
            .connect_timeout(GRPC_CONNECT_TIMEOUT);
        let channel = endpoint
            .connect()
            .await
            .map_err(|error| AppError::transport(format!("connect failed: {error}")))?;
        {
            let mut guard = self.inner.write().await;
            *guard = Some(channel.clone());
        }
        Ok(channel)
    }

    pub async fn disconnect(&self) {
        let mut guard = self.inner.write().await;
        *guard = None;
    }

    pub async fn is_connected(&self) -> bool {
        self.inner.read().await.is_some()
    }

    pub async fn info(&self) -> AppResult<InfoClient<Channel>> {
        Ok(InfoClient::new(self.connect().await?))
    }

    pub async fn preferences(&self) -> AppResult<PreferencesClient<Channel>> {
        Ok(PreferencesClient::new(self.connect().await?))
    }

    pub async fn providers(&self) -> AppResult<ProvidersClient<Channel>> {
        Ok(ProvidersClient::new(self.connect().await?))
    }

    pub async fn llm_models(&self) -> AppResult<LlmModelsClient<Channel>> {
        Ok(LlmModelsClient::new(self.connect().await?))
    }

    pub async fn agents(&self) -> AppResult<AgentsClient<Channel>> {
        Ok(AgentsClient::new(self.connect().await?))
    }

    pub async fn bricks(&self) -> AppResult<BricksClient<Channel>> {
        Ok(BricksClient::new(self.connect().await?))
    }

    pub async fn conversations(&self) -> AppResult<ConversationsClient<Channel>> {
        Ok(ConversationsClient::new(self.connect().await?))
    }

    pub async fn messages(&self) -> AppResult<MessagesClient<Channel>> {
        Ok(MessagesClient::new(self.connect().await?))
    }

    pub async fn blobs(&self) -> AppResult<BlobsClient<Channel>> {
        Ok(BlobsClient::new(self.connect().await?))
    }

    pub async fn gateways(&self) -> AppResult<GatewaysClient<Channel>> {
        Ok(GatewaysClient::new(self.connect().await?))
    }
}

impl Default for GrpcClient {
    fn default() -> Self {
        Self::new()
    }
}
