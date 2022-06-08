import type { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import { Grid, GridItem, Heading, Link, Text, VStack } from "@chakra-ui/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import NextLink from "next/link";
import { CenteredContainer } from "@components/CenteredContainer";

const links = [
  {
    link: "/",
    heading: "Full test",
    text: "Pass the entire exercise",
  },
  {
    link: "/configurationEditor",
    heading: "Configuration builder",
    text: "Build your own configuration",
  },
  {
    link: "/dynamicTest",
    heading: "Dynamic test",
    text: "Test your mental rotation abilities",
  },
  {
    link: "/taskCreator",
    heading: "Task creator",
    text: "Test your mental rotation abilities",
  },
  {
    link: "/data/users",
    heading: "User data",
    text: "Check user data",
  },
];

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ["all"])),
      lang: context.locale,
    },
  };
};

const Home: NextPage = ({
  lang,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("all");
  return (
    <CenteredContainer showFooter flexDir={"column"}>
      <VStack textAlign={"center"}>
        <Heading py={5}>{t("Mental rotation digital test")}</Heading>

        <Text fontSize={"lg"}>
          {t("Welcome to digitalized configurable PSVT:R")}.<br />
          {t("Get started by visiting the following links:")}
        </Text>
      </VStack>

      <Grid mt={16} templateColumns={"1fr 1fr"} gap={6}>
        {links.map(({ link, heading, text }) => (
          <GridItem
            key={link}
            p={5}
            borderRadius={5}
            background={"purple.50"}
            _hover={{
              background: "purple.200",
            }}
          >
            <NextLink href={link} locale={lang}>
              <Link href={link}>
                <Heading size={"md"} pb={2}>
                  {t(heading)}
                </Heading>
                <Text>{text}</Text>
              </Link>
            </NextLink>
          </GridItem>
        ))}
      </Grid>
    </CenteredContainer>
  );
};

export default Home;
