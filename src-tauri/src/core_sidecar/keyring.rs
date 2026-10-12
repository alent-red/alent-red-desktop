use base64::engine::general_purpose::STANDARD as BASE64_STANDARD;
use base64::Engine;
use keyring::Entry;
use rand::rngs::OsRng;
use rand::RngCore;

use crate::error::{AppError, AppResult};

const KEYRING_SERVICE: &str = "red.alent.desktop";
const KEYRING_ENTRY: &str = "core-encryption-key";
const ENCRYPTION_KEY_BYTES: usize = 32;

pub(crate) fn load_or_generate_encryption_key() -> AppResult<String> {
    let entry = Entry::new(KEYRING_SERVICE, KEYRING_ENTRY)
        .map_err(|error| AppError::internal(format!("Failed to open keyring entry: {error}")))?;

    match entry.get_password() {
        Ok(existing) => Ok(existing),
        Err(keyring::Error::NoEntry) => {
            let generated = generate_key();
            entry.set_password(&generated).map_err(|error| {
                AppError::internal(format!("Failed to store encryption key: {error}"))
            })?;
            Ok(generated)
        }
        Err(error) => Err(AppError::internal(format!(
            "Failed to read encryption key from keyring: {error}"
        ))),
    }
}

fn generate_key() -> String {
    let mut bytes = [0_u8; ENCRYPTION_KEY_BYTES];
    OsRng.fill_bytes(&mut bytes);
    BASE64_STANDARD.encode(bytes)
}
