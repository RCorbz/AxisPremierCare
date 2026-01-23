{ pkgs, ... }: {
  channel = "stable-24.05";
  packages = [
    pkgs.nodejs_22
    pkgs.bun
    pkgs.inotify-tools
  ];
  env = {};
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
      # This is the crucial fix. It forces the environment to be correctly sourced
      # before running npm install, ensuring the correct Node.js version is used.
      onStart = {
        check = "once";
        command = "source /nix/var/nix/profiles/default/etc/profile.d/nix-daemon.sh && npm install";
      };
    };
  }; 
}
