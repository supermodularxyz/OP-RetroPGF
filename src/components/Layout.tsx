import Head from "next/head";
import { type PropsWithChildren } from "react";

import { SunnyBanner } from "./SunnyBanner";
import { Header } from "./Header";

export const Layout = (props: PropsWithChildren) => {
  return (
    <>
      <Head>
        <title>Retro PGF</title>
      </Head>

      <main>
        <Header />
        <div className="gap-8 pt-12 md:flex">
          <Sidebar>
            <SunnyBanner />
          </Sidebar>

          <div className="">{props.children}</div>
        </div>
      </main>
    </>
  );
};

const Sidebar = (props: PropsWithChildren) => (
  <div className="px-2 md:px-8" {...props} />
);
