import clsx from "clsx";
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
    <Sidebar side={props.sidebar}>
      {address ? <BallotOverview /> : <SunnyBanner />}
    </Sidebar>
  );
  return (
    <>
      <Head>
        <title>Retro PGF</title>
      </Head>

      <main className="text-gray-900">
        <Header />
        <div className="mx-auto pt-12  2xl:container md:flex">
          {props.sidebar === "left" ? sidebar : null}
          <div
            className={clsx("min-w-0 flex-1 px-4 pb-24", {
              ["mx-auto max-w-5xl"]: !props.sidebar,
            })}
          >
            {props.children}
          </div>
          {props.sidebar === "right" ? sidebar : null}
        </div>
      </main>
    </>
  );
};

const Sidebar = ({
  side,
  ...props
}: { side?: "left" | "right" } & PropsWithChildren) => (
  <div className="">
    <div
      className={clsx("px-2 md:w-[336px] md:px-4", {
        ["left-0 top-[2rem] md:sticky"]: side === "left",
      })}
      {...props}
    />
  </div>
);
