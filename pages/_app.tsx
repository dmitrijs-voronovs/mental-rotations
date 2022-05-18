import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "@pagestyles/theme";
import { appWithTranslation } from "next-i18next";
import i18nextConfig from "next-i18next.config";
import Head from "next/head";
import { SwitchToDesktopOverlay } from "@components/SwitchToDesktopOverlay";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <Head>
          <title>Mental Rotation Test</title>
          <meta name="description" content="Mental rotation test" />
          <link rel="icon" href="/icon-192x192.png" />
        </Head>
        <SwitchToDesktopOverlay />
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  );
}

export default appWithTranslation(MyApp, i18nextConfig);
