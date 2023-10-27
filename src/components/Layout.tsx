import clsx from "clsx";
import Head from "next/head";
import { useState, type PropsWithChildren, useEffect } from "react";
import { useAccount } from "wagmi";

import { SunnyBanner } from "./SunnyBanner";
import { Header } from "./Header";
import { BallotOverview } from "./BallotOverview";
import { useRouter } from "next/router";

const metadata = {
  title: "Retro PGF",
  description: `Retroactive Public Goods Funding (RetroPGF) Round 3 will take place this fall and will distribute 30M OP to reward contributions that have supported the development and adoption of Optimism.`,
  url: "https://round3.optimism.io",
  image: "https://retro-pgf-staging.vercel.app/meta_image.png",
};
export const Layout = (
  props: {
    sidebar?: "left" | "right";
    requireAuth?: boolean;
  } & PropsWithChildren
) => {
  const router = useRouter();
  const { address, isConnecting } = useAccount();
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);
  if (!isLoaded) return null;

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
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />

        <meta property="og:url" content={metadata.url} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Optimism" />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:image" content={metadata.image} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="optimism.io" />
        <meta property="twitter:url" content={metadata.url} />
        <meta name="twitter:title" content="Optimism" />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content={metadata.image} />
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
