import type { Preview } from "@storybook/react";

import React from "react";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Providers } from "~/providers";
import "@rainbow-me/rainbowkit/styles.css";
import "../src/styles/globals.css";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },

  decorators: [
    (Story) => {
      return (
        <Providers>
          <Connect />
          <Story />
        </Providers>
      );
    },
  ],
};

function Connect() {
  const { connector, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();
  return (
    <div className="text-xs">
      <div>
        {isConnected ? <button onClick={disconnect}>__connected__</button> : ""}
        {connectors
          .filter((x) => x.ready && x.id !== connector?.id)
          .map((x) => (
            <button
              key={x.id}
              role="button"
              onClick={() => {
                connect({ connector: x, chainId: 31337 });
              }}
            >
              {isLoading && x.id === pendingConnector?.id && "Connecting to "}
              {x.name}
            </button>
          ))}
      </div>

      {error && <div role="alert">{error.message}</div>}
    </div>
  );
}

export default preview;
