// -- Entry Point --
// Initializes the Dojo SDK (connects to Torii indexer), then wraps the app in
// providers so every component can query on-chain state and execute system calls.

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { init } from "@dojoengine/sdk";
import { DojoSdkProvider } from "@dojoengine/sdk/react";
import { dojoConfig, TORII_URL } from "./dojo/config";
import { type SchemaType } from "./dojo/models";
import { setupWorld } from "./dojo/contracts";
import StarknetProvider from "./starknet";
import App from "./App";

async function main() {
  // SDK client handles entity subscriptions and typed model access. SchemaType ensures type safety.
  const sdk = await init<SchemaType>({
    client: {
      // Torii needs the world address to know which on-chain events to index.
      worldAddress: dojoConfig.manifest.world.address,
      toriiUrl: TORII_URL,
    },
    domain: {
      name: "starter",
      version: "1.0",
      chainId: "KATANA",
      revision: "1",
    },
  });

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      {/* DojoSdkProvider makes the SDK available via useDojoSDK() hook.
          clientFn (setupWorld) creates typed wrappers for each system call. */}
      <DojoSdkProvider
        sdk={sdk}
        dojoConfig={dojoConfig}
        clientFn={setupWorld}
      >
        <StarknetProvider>
          <App />
        </StarknetProvider>
      </DojoSdkProvider>
    </StrictMode>
  );
}

main();
