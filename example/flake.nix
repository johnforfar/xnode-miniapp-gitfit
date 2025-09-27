{
  inputs = {
    xnode-manager.url = "github:Openmesh-Network/xnode-manager";
    git-fit-miniapp.url = "github:johnforfar/xnode-miniapp-gitfit"; # "path:..";
    nixpkgs.follows = "git-fit-miniapp/nixpkgs";
  };

  outputs = inputs: {
    nixosConfigurations.container = inputs.nixpkgs.lib.nixosSystem {
      specialArgs = {
        inherit inputs;
      };
      modules = [
        inputs.xnode-manager.nixosModules.container
        {
          services.xnode-container.xnode-config = {
            host-platform = ./xnode-config/host-platform;
            state-version = ./xnode-config/state-version;
            hostname = ./xnode-config/hostname;
          };
        }
        inputs.git-fit-miniapp.nixosModules.default
        {
          services.xnode-miniapp-template.enable = true;
          services.xnode-miniapp-template.url = "http://localhost:3000";
        }
      ];
    };
  };
}
