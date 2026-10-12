use std::collections::HashMap;
use std::sync::Arc;

use tokio::sync::Mutex;
use tokio::task::JoinHandle;

pub struct StreamRegistry {
    inner: Arc<Mutex<HashMap<String, JoinHandle<()>>>>,
}

impl std::fmt::Debug for StreamRegistry {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        formatter
            .debug_struct("StreamRegistry")
            .finish_non_exhaustive()
    }
}

impl StreamRegistry {
    pub fn new() -> Self {
        Self {
            inner: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    pub async fn register(&self, key: String, handle: JoinHandle<()>) {
        let previous = {
            let mut guard = self.inner.lock().await;
            guard.insert(key, handle)
        };
        if let Some(previous) = previous {
            previous.abort();
        }
    }

    pub async fn cancel(&self, key: &str) -> bool {
        let removed = {
            let mut guard = self.inner.lock().await;
            guard.remove(key)
        };
        let Some(handle) = removed else {
            return false;
        };
        handle.abort();
        true
    }
}

impl Default for StreamRegistry {
    fn default() -> Self {
        Self::new()
    }
}
