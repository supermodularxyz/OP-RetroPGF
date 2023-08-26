import Head from "next/head";
import { useState, type PropsWithChildren, useEffect } from "react";
import { useAccount } from "wagmi";

import { SunnyBanner } from "./SunnyBanner";
import { Header } from "./Header";
import { BallotOverview } from "./BallotOverview";
import { EligibilityDialog } from "./EligibilityDialog";

export const Layout = (props: PropsWithChildren) => {
  const { address } = useAccount();
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);
  if (!isLoaded) return null;

  return (
    <>
      <Head>
        <title>Retro PGF</title>
      </Head>

      <main className="text-gray-900">
        <Header />
        <div className="container mx-auto max-w-screen-2xl gap-8 pt-12 md:flex">
          <Sidebar>{address ? <BallotOverview /> : <SunnyBanner />}</Sidebar>

          <div className="flex-1 px-4 pb-24">{props.children}</div>
        </div>
        <EligibilityDialog />
      </main>
    </>
  );
};

const Sidebar = (props: PropsWithChildren) => (
  <div className="px-2 md:px-8" {...props} />
);
