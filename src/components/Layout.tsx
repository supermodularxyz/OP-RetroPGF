import clsx from "clsx";
import Head from "next/head";
import { type PropsWithChildren } from "react";
import { useAccount } from "wagmi";

import { SunnyBanner } from "./SunnyBanner";
import { Header } from "./Header";
import { BallotOverview } from "./BallotOverview";
import { useRouter } from "next/router";
import { Code } from "./icons";
import { FaCode, FaGithub } from "react-icons/fa6";

const VOTING_END_DATE =
  process.env.NEXT_PUBLIC_VOTING_END_DATE ??
  new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString();

export const Layout = (
  props: {
    sidebar?: "left" | "right";
    requireAuth?: boolean;
  } & PropsWithChildren
) => {
  const router = useRouter();
  const { address, isConnecting } = useAccount();
  const votingHasEnded = new Date(VOTING_END_DATE) < new Date();

  if (props.requireAuth && !address && !isConnecting) {
    void router.push("/");
    return null;
  }

  const sidebar = (
    <Sidebar side={props.sidebar}>
      {address && !votingHasEnded ? <BallotOverview /> : <SunnyBanner />}
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

      <main className="flex h-full flex-1 flex-col text-gray-900">
        <Header />
        <div className="mx-auto h-full w-full flex-1 pt-12 2xl:container lg:flex">
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
        <footer className="flex flex-col items-center justify-center bg-gray-950 p-2 text-gray-400">
          <a
            href={"https://github.com/gitcoinco/easy-retro-pgf/"}
            target="_blank"
            className="group py-4 text-sm hover:text-white"
          >
            <div className="flex">
              Built with{" "}
              <span className="relative -mt-1 w-6 px-1 text-xl text-primary-600">
                <span className="absolute">❤️</span>
                <span className="absolute group-hover:animate-ping">❤️</span>
              </span>
              by EasyRetroPGF.
            </div>
            <div className="inline-flex">
              Run your own RPGF Round
              <FaGithub className="ml-1 mt-0.5 h-4 w-4" />
            </div>
          </a>
        </footer>
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
