import { type AppType } from "next/dist/shared/lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { Analytics } from "@vercel/analytics/react";

import {
  PersistQueryClientProvider,
  persistQueryClientSave,
} from "@tanstack/react-query-persist-client";
import { Providers } from "~/providers";

import "@rainbow-me/rainbowkit/styles.css";
import "~/styles/globals.css";

const ONE_HOUR = 1000 * 60 * 60;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: ONE_HOUR * 24,
      staleTime: ONE_HOUR,
    },
  },
});

const persister = createSyncStoragePersister({
  storage: typeof window !== "undefined" ? window.localStorage : null,
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        buster: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? "hash",
      }}
    >
      <QueryClientProvider client={queryClient}>
        <Providers>
          <>
            <Component {...pageProps} />
            <Analytics mode={"production"} />
          </>
        </Providers>
      </QueryClientProvider>
    </PersistQueryClientProvider>
  );
};

export default MyApp;
