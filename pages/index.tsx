import type { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.scss";
import { Box, Grid, GridItem, Heading, Link, Text } from "@chakra-ui/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import NextLink from "next/link";

const links = [
  {
    link: "/tests",
    heading: "Mental rotation test",
    text: "Complete mental rotation test and get the score",
  },
  {
    link: "/forms/emotionTest",
    heading: "Emotion test",
    text: "Complete emotion wheel test",
  },
  {
    link: "/forms/newUser",
    heading: "User details",
    text: "Complete user details form and get the score",
  },
  {
    link: "/forms/phq9",
    heading: "Psychological test",
    text: "Complete psychological test and get the score",
  },
  {
    link: "/userInfo",
    heading: "User info",
    text: "Check your user info",
  },
  {
    link: "/configurationEditor",
    heading: "Configuration builder",
    text: "Build your own configuration",
  },
  {
    link: "/proto/App",
    heading: "PSVT:R Test",
    text: "Test your mental rotation abilities",
  },
  {
    link: "/signIn",
    heading: "Sing in",
    text: "Sing into your account",
  },
];

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ["common"])),
      lang: context.locale,
    },
  };
};

const Home: NextPage = ({
  lang,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <Head>
        <title>PSVT:R</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/icon-192x192.png" />
      </Head>

      <main className={styles.main}>
        <Heading>{t("PSVT:R digital test")}</Heading>
        <p className={styles.description}>
          Welcome to digitalized configurable PSVT:R
        </p>

        <p className={styles.description}>
          Get started by visiting the following links:
        </p>

        <Grid mt={"2rem"} templateColumns={"1fr 1fr"} gap={"2rem"}>
          {links.map(({ link, heading, text }) => (
            <GridItem
              key={link}
              p={"2rem"}
              border={"1px solid transparent"}
              borderRadius={"2rem"}
              transition="transform ease-in-out .2s, box-shadow ease-in-out .2s, border-color ease-in-out .2s"
              sx={{
                _hover: {
                  border: "1px solid",
                },
              }}
            >
              <NextLink href={link} locale={lang}>
                <Link href={link}>
                  <h2>{heading} &rarr;</h2>
                  <p>{text}</p>
                </Link>
              </NextLink>
            </GridItem>
          ))}
        </Grid>
      </main>

      <footer className={styles.footer}>
        <Box textAlign={"center"}>
          Made by <Text as={"b"}>Dmitry Voronov</Text>
        </Box>
      </footer>
    </div>
  );
};

export default Home;
