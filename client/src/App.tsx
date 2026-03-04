import { useEffect, useState } from "react";
import { KeysClause, ToriiQueryBuilder } from "@dojoengine/sdk";
import {
  useDojoSDK,
  useEntityId,
  useEntityQuery,
  useModel,
} from "@dojoengine/sdk/react";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { ControllerConnector } from "@cartridge/connector";
import { addAddressPadding, CairoCustomEnum } from "starknet";
import { ModelsMapping } from "./dojo/models";

type Direction = "Left" | "Right" | "Up" | "Down";

function App() {
  const { client } = useDojoSDK();
  const { account, address } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [pending, setPending] = useState(false);
  const [username, setUsername] = useState<string>();
  const controller = connectors[0] as ControllerConnector;

  useEffect(() => {
    if (!address) return;
    controller.username()?.then(setUsername);
  }, [address, controller]);

  const entityId = useEntityId(address ?? "0");

  useEntityQuery(
    new ToriiQueryBuilder()
      .withClause(
        KeysClause(
          [ModelsMapping.Position],
          [address ? addAddressPadding(address) : undefined],
          "FixedLen"
        ).build()
      )
      .includeHashedKeys()
  );

  const position = useModel(entityId as string, ModelsMapping.Position);

  const move = async (direction: Direction) => {
    if (!account) return;
    setPending(true);
    try {
      await client.actions.move(
        account,
        new CairoCustomEnum({ [direction]: {} })
      );
    } finally {
      setPending(false);
    }
  };

  if (!address) {
    return (
      <div>
        <h1>Dojo Starter</h1>
        <button onClick={() => connect({ connector: controller })}>
          Log in
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Dojo Starter</h1>
      <p>
        {username ?? `${address.slice(0, 6)}...${address.slice(-4)}`}
      </p>
      <button onClick={() => disconnect()}>Log out</button>
      <hr />
      <p>
        Position: ({position?.x ?? 0}, {position?.y ?? 0})
      </p>
      <div>
        <button onClick={() => move("Up")} disabled={pending}>
          Up
        </button>
        <br />
        <button onClick={() => move("Left")} disabled={pending}>
          Left
        </button>
        <button onClick={() => move("Right")} disabled={pending}>
          Right
        </button>
        <br />
        <button onClick={() => move("Down")} disabled={pending}>
          Down
        </button>
      </div>
      {pending && <p>Transaction pending...</p>}
    </div>
  );
}

export default App;
