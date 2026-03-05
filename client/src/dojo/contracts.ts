// -- System Call Wrappers --
// Each function maps to a #[dojo::contract] entry point in actions.cairo.

import type { DojoProvider } from "@dojoengine/core";
import type { Account, AccountInterface, CairoCustomEnum } from "starknet";

export function setupWorld(provider: DojoProvider) {
  const spawn = async (account: Account | AccountInterface) => {
    // provider.execute submits a tx to the Dojo world, routing to the contract by name.
    return await provider.execute(
      account,
      { contractName: "actions", entrypoint: "spawn", calldata: [] },
      "starter",
      { tip: 0 }
    );
  };

  const move = async (
    account: Account | AccountInterface,
    direction: CairoCustomEnum // Serializes a Cairo enum to calldata; variant name must match exactly
  ) => {
    return await provider.execute(
      account,
      { contractName: "actions", entrypoint: "move", calldata: [direction] },
      "starter",
      { tip: 0 }
    );
  };

  const dig = async (account: Account | AccountInterface) => {
    return await provider.execute(
      account,
      { contractName: "actions", entrypoint: "dig", calldata: [] },
      "starter",
      { tip: 0 }
    );
  };

  // Shape must match what DojoSdkProvider's clientFn expects; accessed via useDojoSDK().client.
  return { actions: { spawn, move, dig } };
}
