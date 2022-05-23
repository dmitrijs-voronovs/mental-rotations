import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "@pagestyles/theme";
import { appWithTranslation, useTranslation } from "next-i18next";
import i18nextConfig from "next-i18next.config";
import Head from "next/head";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const { t } = useTranslation();
  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <Head>
          <title>{t("Object Rotation")}</title>
          <meta name="description" content="Object Rotation" />
          <link rel="icon" href="/icon-192x192.png" />
        </Head>
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  );
}

export default appWithTranslation(MyApp, i18nextConfig);
