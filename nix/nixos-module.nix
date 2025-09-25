{
  config,
  pkgs,
  lib,
  ...
}:
let
  cfg = config.services.xnode-miniapp-template;
  xnode-miniapp-template = pkgs.callPackage ./package.nix { };
in
{
  options = {
    services.xnode-miniapp-template = {
      enable = lib.mkEnableOption "Enable the nextjs app";

      hostname = lib.mkOption {
        type = lib.types.str;
        default = "0.0.0.0";
        example = "127.0.0.1";
        description = ''
          The hostname under which the app should be accessible.
        '';
      };

      port = lib.mkOption {
        type = lib.types.port;
        default = 3000;
        example = 3000;
        description = ''
          The port under which the app should be accessible.
        '';
      };

      openFirewall = lib.mkOption {
        type = lib.types.bool;
        default = true;
        description = ''
          Whether to open ports in the firewall for this application.
        '';
      };
    };
  };

  config = lib.mkIf cfg.enable {
    users.groups.xnode-miniapp-template = { };
    users.users.xnode-miniapp-template = {
      isSystemUser = true;
      group = "xnode-miniapp-template";
    };

    systemd.services.xnode-miniapp-template = {
      wantedBy = [ "multi-user.target" ];
      description = "Mini App.";
      after = [ "network.target" ];
      environment = {
        HOSTNAME = cfg.hostname;
        PORT = toString cfg.port;
      };
      serviceConfig = {
        ExecStart = "${lib.getExe xnode-miniapp-template}";
        User = "xnode-miniapp-template";
        Group = "xnode-miniapp-template";
        CacheDirectory = "mini-app";
      };
    };

    networking.firewall = lib.mkIf cfg.openFirewall {
      allowedTCPPorts = [ cfg.port ];
    };
  };
}
