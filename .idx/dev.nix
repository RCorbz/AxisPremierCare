{ pkgs, ... }: {
  channel = "stable-24.05";
  packages = [
    pkgs.nodejs_22
    pkgs.bun
  ];
  env = {
    # Force NodePath to current derivation
    NODE_PATH = "${pkgs.nodejs_22}/lib/node_modules";
  };
  idx = {
    extensions = [
      "vitest.explorer"
      "zixuanchen.open-in-external-app"
      "eamodio.gitlens"
      "dbaeumer.vscode-eslint"
      "bradlc.vscode-tailwindcss"
    ];
    previews = {
      enable = true;
      previews = {
        web = {
          command = [ "npm" "run" "dev" "--" "--port" "$PORT" "--host" "0.0.0.0" ];
          manager = "web";
        };
      };
    };
    workspace = {
      onStart = {
        check = "once";
        # Force install with correct node version
        command = "npm install";
      };
    };
  };
}
