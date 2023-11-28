import { type Address } from "viem";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type WalletClient, useWalletClient } from "wagmi";
import { use, useMemo } from "react";
import { providers } from "ethers";
import { type SignerOrProvider } from "@ethereum-attestation-service/eas-sdk/dist/transaction";

import { createAttestation } from "~/utils/eas";
import { CreateList } from "~/schemas/list";
import { useLocalStorage } from "react-use";

export type ListAttestation = {
  listName: string;
  listMetadataPtrType: number;
  listMetadataPtr: string;
  owner: Address;
};

export function useCreateList() {
  const signer = useEthersSigner();
  return useMutation(async (list: ListAttestation) =>
    createAttestation(list, signer as unknown as SignerOrProvider)
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
