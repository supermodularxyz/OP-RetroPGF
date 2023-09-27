import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Providers } from "~/providers";

import "@rainbow-me/rainbowkit/styles.css";
import "~/styles/globals.css";
import { trpc } from "~/utils/trpc";
import { Session } from "next-auth";
import { AppProps } from "next/app";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

const persister = createSyncStoragePersister({
  storage: typeof window !== "undefined" ? window.localStorage : null,
});

const MyApp = ({ Component, pageProps }: AppProps & { session: Session }) => {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <QueryClientProvider client={queryClient}>
        <Providers session={pageProps.session}>
          <Component {...pageProps} />
        </Providers>
      </QueryClientProvider>
    </PersistQueryClientProvider>
  );
};

export default trpc.withTRPC(MyApp);
