import Head from "next/head";
import { useState, type PropsWithChildren, useEffect } from "react";
import { useAccount } from "wagmi";

import { SunnyBanner } from "./SunnyBanner";
import { Header } from "./Header";
import { BallotOverview } from "./BallotOverview";

export const Layout = (
  props: { sidebar?: "left" | "right" } & PropsWithChildren
) => {
  const { address } = useAccount();
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);
  if (!isLoaded) return null;

  const sidebar = (
    <Sidebar>{address ? <BallotOverview /> : <SunnyBanner />}</Sidebar>
  );
  return (
    <>
      <Head>
        <title>Retro PGF</title>
      </Head>

      <main className="text-gray-900">
        <Header />
        <div className="container mx-auto max-w-screen-2xl gap-8 pt-12 md:flex">
          {props.sidebar === "left" || !props.sidebar ? sidebar : null}
          <div className="min-w-0 flex-1 px-4 pb-24">{props.children}</div>
          {props.sidebar === "right" ? sidebar : null}
        </div>
      </main>
    </>
  );
};

const Sidebar = (props: PropsWithChildren) => (
  <div className="px-2 md:px-8" {...props} />
);
