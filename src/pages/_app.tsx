import { type AppType } from "next/dist/shared/lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import {
  PersistQueryClientProvider,
  persistQueryClientSave,
} from "@tanstack/react-query-persist-client";
import { Providers } from "~/providers";

import "@rainbow-me/rainbowkit/styles.css";
import "~/styles/globals.css";

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

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <QueryClientProvider client={queryClient}>
        <Providers>
          <Component {...pageProps} />
        </Providers>
      </QueryClientProvider>
    </PersistQueryClientProvider>
  );
};

export default MyApp;
