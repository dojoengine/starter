import type { PropsWithChildren } from "react";
import { mainnet } from "@starknet-react/chains";
import {
  jsonRpcProvider,
  StarknetConfig,
  cartridge,
} from "@starknet-react/core";
import { ControllerConnector } from "@cartridge/connector";
import { RPC_URL } from "./dojo/config";

const connector = new ControllerConnector({
  chains: [{ rpcUrl: RPC_URL }],
});

const provider = jsonRpcProvider({
  rpc: () => ({ nodeUrl: RPC_URL }),
});

export default function StarknetProvider({ children }: PropsWithChildren) {
  return (
    <StarknetConfig
      chains={[mainnet]}
      provider={provider}
      connectors={[connector]}
      explorer={cartridge}
      autoConnect
    >
      {children}
    </StarknetConfig>
  );
}
