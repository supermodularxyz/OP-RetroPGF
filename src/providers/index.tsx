import { type PropsWithChildren } from "react";
import { Inter } from "next/font/google";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { hardhat, optimism, optimismGoerli } from "wagmi/chains";
import { MockConnector } from "wagmi/connectors/mock";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const { chains, publicClient } = configureChains(
  [optimism, optimismGoerli],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID! }),
    publicProvider(),
  ]
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

const persister = createSyncStoragePersister({
  storage: typeof window !== "undefined" ? window.localStorage : null,
});

const { connectors } = getDefaultWallets({
  appName: "Retro PGF",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID!,
  chains,
});

const isTest = process.env.NODE_ENV === "test";
const testConnectors = [
  new MockConnector({
    chains: [hardhat],
    options: {
      walletClient: createWalletClient({
        chain: hardhat,
        transport: http("http://localhost:8545"),
        account: privateKeyToAccount(
          "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
        ),
      }),
    },
  }),
];

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: isTest ? testConnectors : connectors,
  publicClient,
});

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains}>
            <style jsx global>{`
              :root {
                --font-inter: ${inter.style.fontFamily};
              }
            `}</style>
            <main className={`${inter.variable} font-sans`}>{children}</main>
          </RainbowKitProvider>
        </WagmiConfig>
      </QueryClientProvider>
    </PersistQueryClientProvider>
  );
};
