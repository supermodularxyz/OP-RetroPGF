import { type AppType } from "next/dist/shared/lib/utils";
import "~/styles/globals.css";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <main className={`${inter.variable} font-sans`}>
      <Component {...pageProps} />
    </main>
  );
};

export default MyApp;
