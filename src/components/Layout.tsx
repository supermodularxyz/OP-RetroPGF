import Head from "next/head";
import Link from "next/link";
import { type PropsWithChildren } from "react";
import { useAccount } from "wagmi";

import { SunnyBanner } from "./SunnyBanner";
import { Header } from "./Header";
import { Dialog } from "./Dialog";
import { Banner } from "./ui/Banner";
import { useBadgeHolder } from "~/hooks/useBadgeHolder";
import { BallotOverview } from "./BallotOverview";

export const Layout = (props: PropsWithChildren) => {
  const { address } = useAccount();
  const { data, isLoading } = useBadgeHolder(address!);

  const isBadgeholder = data && !isLoading;
  return (
    <>
      <Head>
        <title>Retro PGF</title>
      </Head>

      <main className="text-gray-900">
        <Header />
        <div className="gap-8 pt-12 md:flex">
          <Sidebar>{address ? <BallotOverview /> : <SunnyBanner />}</Sidebar>

          <div className="">{props.children}</div>
        </div>

        <Dialog
          isOpen={!isBadgeholder && Boolean(address)}
          title={"You are not eligible to vote 😔"}
        >
          <Banner variant="warning">
            Only badgeholders are able to vote in RetroPGF. You can find out
            more about how badgeholders are selected{" "}
            <Link
              href=""
              target="_blank"
              className="underline underline-offset-2"
            >
              here
            </Link>
            .
          </Banner>
        </Dialog>
      </main>
    </>
  );
};

const Sidebar = (props: PropsWithChildren) => (
  <div className="px-2 md:px-8" {...props} />
);
