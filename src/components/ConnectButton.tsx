import { SiweMessage } from "siwe";
import Image from "next/image";
import Link from "next/link";
import { type PropsWithChildren, type ComponentPropsWithRef } from "react";
import {
  type Address,
  useEnsAvatar,
  useEnsName,
  useSignMessage,
  useAccount,
  useNetwork,
} from "wagmi";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { createBreakpoint } from "react-use";

import { Button } from "./ui/Button";
import { Chip } from "./ui/Chip";
import { AddBallot } from "./icons";
import { useBallot } from "~/hooks/useBallot";
import { EligibilityDialog } from "./EligibilityDialog";
import { useNonce, useSession, useVerify } from "~/hooks/useAuth";
import { Dialog } from "./ui/Dialog";

const useBreakpoint = createBreakpoint({ XL: 1280, L: 768, S: 350 });

export const ConnectButton = () => {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "S";

  return (
    <RainbowConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const connected = mounted && account && chain;

        return (
          <div
            {...(!mounted && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    className="rounded-full"
                    variant="primary"
                  >
                    {isMobile ? "Connect" : "Connect wallet"}
                  </Button>
                );
              }

              if (chain.unsupported) {
                return <Chip onClick={openChainModal}>Wrong network</Chip>;
              }

              return (
                <ConnectedDetails
                  account={account}
                  openAccountModal={openAccountModal}
                  isMobile={isMobile}
                />
              );
            })()}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
};

const ConnectedDetails = ({
  openAccountModal,
  account,
  isMobile,
}: {
  account: { address: string; displayName: string };
  openAccountModal: () => void;
  isMobile: boolean;
}) => {
  const { data: ballot } = useBallot();
  const ballotSize = (ballot?.votes ?? []).length;

  return (
    <SignMessage>
      <div className="flex gap-2">
        {ballot?.publishedAt ? (
          <Chip>Already submitted</Chip>
        ) : (
          <Chip className="gap-2" as={Link} href={"/ballot"}>
            {isMobile ? <AddBallot className="h-4 w-4" /> : `View Ballot`}
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs ">
              {ballotSize}
            </div>
          </Chip>
        )}
        <UserInfo
          onClick={openAccountModal}
          address={account.address as Address}
        >
          {isMobile ? null : account.displayName}
        </UserInfo>
        <EligibilityDialog />
      </div>
    </SignMessage>
  );
};

const UserInfo = ({
  address,
  children,
  ...props
}: { address: Address } & ComponentPropsWithRef<typeof Chip>) => {
  const ens = useEnsName({ address, chainId: 1, enabled: Boolean(address) });
  const name = ens.data;
  const avatar = useEnsAvatar({ name, chainId: 1, enabled: Boolean(name) });

  return (
    <Chip className="gap-2" {...props}>
      <div className="h-6 w-6 overflow-hidden rounded-full">
        {avatar.data ? (
          <Image width={24} height={24} alt={name!} src={avatar.data} />
        ) : (
          <div className="h-full bg-gray-200" />
        )}
      </div>
      {children}
    </Chip>
  );
};

const SignMessage = ({ children }: PropsWithChildren) => {
  const sign = useSignMessage();
  const verify = useVerify();
  const { chain: { id: chainId } = {} } = useNetwork();
  const { address } = useAccount();
  const { data: nonce } = useNonce();
  const { data: session } = useSession();

  async function handleSign() {
    if (nonce) {
      const message = new SiweMessage({
        version: "1",
        domain: window.location.host,
        uri: window.location.origin,
        address,
        chainId,
        nonce,
        statement: "Sign in to Agora Optimism",
      }).prepareMessage();
      const signature = await sign.signMessageAsync({ message });
      verify.mutate({ signature, message, nonce });
    }
  }

  if (session?.address) {
    return <>{children}</>;
  }
  return (
    <>
      {children}
      <Dialog size="sm" title="Authenticate" isOpen>
        <p className="mb-4">Sign message to authenticate</p>
        <div className="flex justify-center">
          <Button onClick={handleSign}>Sign message</Button>
        </div>
      </Dialog>
    </>
  );
};
