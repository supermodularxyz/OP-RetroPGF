import Link from "next/link";
import { useAccount, useDisconnect } from "wagmi";

import { Dialog } from "./ui/Dialog";
import { Banner } from "./ui/Banner";
import { useBadgeHolder } from "~/hooks/useBadgeHolder";
import { useSession } from "~/hooks/useAuth";

export const EligibilityDialog = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: session } = useSession();
  const { data, isLoading, error } = useBadgeHolder(address!);

  console.log("isBadgeHolder", data, error);
  if (isLoading || !address || !session || error) return null;

  return (
    <Dialog
      isOpen={data?.length === 0}
      onOpenChange={() => disconnect()}
      title={
        <>
          You are not eligible to vote <span className="font-serif">😔</span>
        </>
      }
    >
      <Banner variant="warning">
        Only badgeholders are able to vote in RetroPGF. You can find out more
        about how badgeholders are selected{" "}
        <Link href="" target="_blank" className="underline underline-offset-2">
          here
        </Link>
        .
      </Banner>
    </Dialog>
  );
};
