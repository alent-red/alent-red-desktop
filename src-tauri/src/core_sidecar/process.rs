use std::sync::Arc;

use tokio::process::Child;
use tokio::sync::Mutex;

#[derive(Debug, Clone, Copy)]
pub struct CoreEndpoint {
    pub port: u16,
}

#[cfg_attr(debug_assertions, allow(dead_code))]
struct Inner {
    child: Child,
    endpoint: CoreEndpoint,
}

pub struct CoreProcess {
    inner: Arc<Mutex<Option<Inner>>>,
}

impl std::fmt::Debug for CoreProcess {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        formatter
            .debug_struct("CoreProcess")
            .finish_non_exhaustive()
    }
}

impl CoreProcess {
    pub fn new() -> Self {
        Self {
            inner: Arc::new(Mutex::new(None)),
        }
    }

    // Dev mode never spawns, so the holder methods would warn as dead code.
    #[cfg(not(debug_assertions))]
    pub(crate) async fn install(&self, child: Child, endpoint: CoreEndpoint) {
        let previous = {
            let mut guard = self.inner.lock().await;
            guard.replace(Inner { child, endpoint })
        };
        if let Some(previous) = previous {
            shutdown_child(previous.child).await;
        }
    }

    #[cfg(not(debug_assertions))]
    pub(crate) async fn endpoint(&self) -> Option<CoreEndpoint> {
        self.inner.lock().await.as_ref().map(|inner| inner.endpoint)
    }

    #[cfg(not(debug_assertions))]
    pub(crate) async fn is_alive(&self) -> bool {
        let mut guard = self.inner.lock().await;
        let Some(inner) = guard.as_mut() else {
            return false;
        };
        if let Ok(None) = inner.child.try_wait() {
            return true;
        }
        guard.take();
        false
    }

    pub async fn shutdown(&self) {
        let inner = {
            let mut guard = self.inner.lock().await;
            guard.take()
        };
        if let Some(inner) = inner {
            shutdown_child(inner.child).await;
        }
    }
}

impl Default for CoreProcess {
    fn default() -> Self {
        Self::new()
    }
}

// SIGKILL via tokio. SQLite's WAL is crash-safe so abrupt termination is
// acceptable; we avoid the unsafe extern needed for a SIGTERM grace period
// (CLAUDE.md forbids `unsafe`).
async fn shutdown_child(mut child: Child) {
    child.kill().await.ok();
    child.wait().await.ok();
}
