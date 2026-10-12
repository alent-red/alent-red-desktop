use std::net::{Ipv4Addr, SocketAddrV4, TcpListener};

use crate::error::{AppError, AppResult};

pub(crate) fn pick_free_loopback_port() -> AppResult<u16> {
    let probe_addr = SocketAddrV4::new(Ipv4Addr::LOCALHOST, 0);
    let listener = TcpListener::bind(probe_addr)
        .map_err(|error| AppError::internal(format!("Failed to probe free port: {error}")))?;
    let port = listener
        .local_addr()
        .map_err(|error| {
            AppError::internal(format!("Failed to read probe socket address: {error}"))
        })?
        .port();
    Ok(port)
}
