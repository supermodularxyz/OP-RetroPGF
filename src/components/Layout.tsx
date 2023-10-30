import clsx from "clsx";
import Head from "next/head";
import { useState, type PropsWithChildren, useEffect } from "react";
import { useAccount } from "wagmi";

import { SunnyBanner } from "./SunnyBanner";
import { Header } from "./Header";
import { BallotOverview } from "./BallotOverview";
import { useRouter } from "next/router";

export const Layout = (
  props: {
    sidebar?: "left" | "right";
    requireAuth?: boolean;
  } & PropsWithChildren
) => {
  const router = useRouter();
  const { address, isConnecting } = useAccount();

  if (props.requireAuth && !address && !isConnecting) {
    void router.push("/");
    return null;
  }

  const sidebar = (
    <Sidebar side={props.sidebar}>
      {address ? <BallotOverview /> : <SunnyBanner />}
    </Sidebar>
  );

  return (
    <>
      <Head>
        <title>{"Retro PGF"}</title>
        <meta
          name="description"
          content={
            "Retroactive Public Goods Funding (RetroPGF) Round 3 will take place this fall and will distribute 30M OP to reward contributions that have supported the development and adoption of Optimism."
          }
        />

        <meta property="og:url" content={"https://retro-pgf.vercel.app"} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={"Retro PGF"} />
        <meta
          property="og:description"
          content={
            "Retroactive Public Goods Funding (RetroPGF) Round 3 will take place this fall and will distribute 30M OP to reward contributions that have supported the development and adoption of Optimism."
          }
        />
        <meta
          property="og:image"
          content={"https://retro-pgf.vercel.app/meta_image.png"}
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="optimism.io" />
        <meta property="twitter:url" content={"https://retro-pgf.vercel.app"} />
        <meta name="twitter:title" content={"Retro PGF"} />
        <meta
          name="twitter:description"
          content={
            "Retroactive Public Goods Funding (RetroPGF) Round 3 will take place this fall and will distribute 30M OP to reward contributions that have supported the development and adoption of Optimism."
          }
        />
        <meta
          name="twitter:image"
          content={"https://retro-pgf.vercel.app/meta_image.png"}
        />
      </Head>

      <main className="text-gray-900">
        <Header />
        <div className="mx-auto pt-12  2xl:container lg:flex">
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
      className={clsx("px-2 lg:w-[336px] lg:px-4", {
        ["left-0 top-[2rem] lg:sticky"]: side === "left",
      })}
      {...props}
    />
  </div>
);
