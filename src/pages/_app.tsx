import { type AppType } from "next/dist/shared/lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Providers } from "~/providers";

import "@rainbow-me/rainbowkit/styles.css";
import "~/styles/globals.css";

const queryClient = new QueryClient();

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Providers>
        <Component {...pageProps} />
      </Providers>
    </QueryClientProvider>
  );
};

export default MyApp;
