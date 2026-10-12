use std::process::Command;

const CORE_PROCESS_NAME: &str = "alent-red-core";

// `pkill` exits with 0 when it killed something, 1 when nothing matched, and
// >1 only for usage/permission errors. Either of the first two is the desired
// outcome here, and the third is unrecoverable from our side, so we drop the
// status regardless.
pub(crate) fn kill_stray_cores() {
    Command::new("pkill")
        .arg("-9")
        .arg("-f")
        .arg(CORE_PROCESS_NAME)
        .status()
        .ok();
}
