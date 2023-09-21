import axios from "axios";
import { type Address } from "viem";
import { useMutation } from "@tanstack/react-query";
import { createAttestation } from "~/utils/eas";
import { type WalletClient, useWalletClient } from "wagmi";
import { useMemo } from "react";
import { providers } from "ethers";

export type ListAttestation = {
  listName: string;
  listMetadataPtrType: number;
  listMetadataPtr: string;
  owner: Address;
};

export function useCreateList() {
  const signer = useEthersSigner();
  return useMutation(async (list: ListAttestation) =>
    createAttestation(list, signer)
  );
}

function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
}

export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId });
  return useMemo(
    () => (walletClient ? walletClientToSigner(walletClient) : undefined),
    [walletClient]
  );
}
