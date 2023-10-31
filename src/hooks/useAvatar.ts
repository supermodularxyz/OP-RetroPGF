import { Address } from "viem";
import { useEnsAvatar, useEnsName } from "wagmi";
import { truncate } from "~/utils/truncate";

export function useAvatar(address?: Address) {
  const ens = useEnsName({ address, chainId: 1, enabled: Boolean(address) });
  const name = ens.data ?? truncate(address);
  const avatar = useEnsAvatar({ name, chainId: 1, enabled: Boolean(name) });
  const error = ens.error ?? avatar.error;
  const isLoading = ens.isLoading ?? avatar.isLoading;
  return {
    ...ens,
    error,
    isLoading,
    data: {
      name,
      avatar:
        avatar.data ?? `https://source.boringavatars.com/marble/16/${address}`,
    },
  };
}
