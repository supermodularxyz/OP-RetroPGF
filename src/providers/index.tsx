import { type PropsWithChildren } from "react";
import { Inter } from "next/font/google";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, optimism } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const { chains, publicClient } = configureChains(
  [mainnet, optimism],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID! }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Retro PGF",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID!,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export const Providers = ({ children }: PropsWithChildren) => {
  return (
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
  );
};
