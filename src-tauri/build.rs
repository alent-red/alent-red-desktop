use std::path::PathBuf;

fn main() {
    compile_protos();
    // Pass our Windows admin manifest through tauri-build's WindowsAttributes
    // so it ends up in the single resource.lib that tauri-build emits. Embedding
    // a separate .lib via embed_resource produces a duplicate RT_MANIFEST that
    // cvtres rejects (CVT1100) and link.exe surfaces as LNK1123. The XML is
    // ignored by tauri-build on non-Windows targets.
    let windows_attributes =
        tauri_build::WindowsAttributes::new().app_manifest(include_str!("windows/admin.manifest"));
    let attributes = tauri_build::Attributes::new().windows_attributes(windows_attributes);
    tauri_build::try_build(attributes).expect("failed to run tauri build");
}

fn compile_protos() {
    let proto_root: PathBuf = PathBuf::from("../protos");
    let proto_files: [PathBuf; 21] = [
        proto_root.join("common/errors.proto"),
        proto_root.join("info/messages.proto"),
        proto_root.join("info/services.proto"),
        proto_root.join("preferences/messages.proto"),
        proto_root.join("preferences/services.proto"),
        proto_root.join("providers/messages.proto"),
        proto_root.join("providers/services.proto"),
        proto_root.join("llm_models/messages.proto"),
        proto_root.join("llm_models/services.proto"),
        proto_root.join("agents/messages.proto"),
        proto_root.join("agents/services.proto"),
        proto_root.join("bricks/messages.proto"),
        proto_root.join("bricks/services.proto"),
        proto_root.join("conversations/messages.proto"),
        proto_root.join("conversations/services.proto"),
        proto_root.join("messages/messages.proto"),
        proto_root.join("messages/services.proto"),
        proto_root.join("blob/messages.proto"),
        proto_root.join("blob/services.proto"),
        proto_root.join("gateways/messages.proto"),
        proto_root.join("gateways/services.proto"),
    ];

    for proto_file in &proto_files {
        println!("cargo:rerun-if-changed={}", proto_file.display());
    }

    tonic_build::configure()
        .build_server(false)
        .build_client(true)
        .out_dir("src/grpc/generated")
        .compile_protos(
            &proto_files
                .iter()
                .map(|p| p.to_string_lossy().into_owned())
                .collect::<Vec<_>>(),
            &[proto_root.to_string_lossy().into_owned()],
        )
        .expect("failed to compile protos");
}
