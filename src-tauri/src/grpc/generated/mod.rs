#![allow(clippy::all)]
#![allow(clippy::pedantic)]
#![allow(clippy::nursery)]
#![allow(clippy::cargo)]
#![allow(dead_code)]
#![allow(non_snake_case)]
#![allow(unused_imports)]
#![allow(missing_debug_implementations)]

pub mod common {
    include!("alent_red_core.common.rs");
}

pub mod info {
    include!("alent_red_core.info.rs");
}

pub mod preferences {
    include!("alent_red_core.preferences.rs");
}

pub mod providers {
    include!("alent_red_core.providers.rs");
}

pub mod llm_models {
    include!("alent_red_core.llm_models.rs");
}

pub mod agents {
    include!("alent_red_core.agents.rs");
}

pub mod bricks {
    include!("alent_red_core.bricks.rs");
}

pub mod conversations {
    include!("alent_red_core.conversations.rs");
}

pub mod messages {
    include!("alent_red_core.messages.rs");
}

pub mod blob {
    include!("alent_red_core.blob.rs");
}

pub mod gateways {
    include!("alent_red_core.gateways.rs");
}
