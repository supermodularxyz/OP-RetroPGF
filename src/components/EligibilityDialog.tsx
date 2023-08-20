import Link from "next/link";
import { useAccount } from "wagmi";

import { Dialog } from "./ui/Dialog";
import { Banner } from "./ui/Banner";
import { useBadgeHolder } from "~/hooks/useBadgeHolder";

export const EligibilityDialog = () => {
  const { address } = useAccount();
  const { data, isLoading } = useBadgeHolder(address!);

  const isBadgeholder = data && !isLoading;
  return (
    <Dialog
      isOpen={Boolean(address) && !isBadgeholder}
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
