import { GetServerSideProps } from "next";
import {
  Box,
  Heading,
  Link,
  List,
  ListItem,
  Text,
  VStack,
} from "@chakra-ui/react";
import { prisma } from "@lib/prisma";
import { getSession } from "next-auth/react";
import { REGULAR_TESTS, TUTORIAL_TEST } from "../config/testNames";
import {
  getFirstEmotionTest,
  getFirstMentalRotationTest,
} from "@utils/status/statusHelpers";
import NextLink from "next/link";
import { FC } from "react";
import { Test } from "@prisma/client";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { CenteredContainer } from "@components/CenteredContainer";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session?.user)
    return {
      redirect: {
        destination: `/${context.locale}/`,
        permanent: false,
      },
    };

  const completedBefore = await Promise.all([
    getFirstEmotionTest(session.user.id),
    getFirstMentalRotationTest(session.user.id),
  ]);

  if (!completedBefore[0] || !!completedBefore[1])
    return {
      redirect: {
        destination: `/${context.locale}/status`,
        permanent: false,
      },
    };

  const tests = await prisma.test.findMany({
    where: {
      name: {
        in: [TUTORIAL_TEST, REGULAR_TESTS[session!.user!.testGroup - 1]],
      },
    },
    include: {
      _count: {
        select: {
          tasks: true,
        },
      },
    },
  });

  // reorder tutorial test to be the first
  const tutorialIdx = tests.findIndex((t) => t.name === TUTORIAL_TEST);
  const tutorialTest = tests.splice(tutorialIdx, 1);
  tests.splice(0, 0, ...tutorialTest);

  return {
    props: {
      tests,
      locale: context.locale,
      ...(await serverSideTranslations(context.locale!, ["common", "other"])),
    },
  };
};

const Tests: FC<{
  tests: (Test & { _count: { tasks: number } })[];
  locale: string | undefined;
}> = ({ tests, locale }) => {
  const { t } = useTranslation(["common", "other"]);
  return (
    <CenteredContainer showNavbar>
      <Box maxW={"xl"} textAlign={"center"}>
        <VStack spacing={5}>
          <Heading textTransform={"uppercase"}>{t("Object rotation")}</Heading>
          <Text fontSize={"xl"} pb={3}>
            {t(
              "Please, start with the tutorial to understand the object rotation specifics. Then proceed to the real exercise!"
            )}
          </Text>
          <List spacing={4}>
            {tests.map((test) => {
              return (
                <ListItem
                  key={test.id}
                  display={"flex"}
                  alignItems={"center"}
                  p={3}
                  borderRadius={"5px"}
                  _hover={{ background: "purple.50" }}
                >
                  <NextLink href={`/tests/${test.id}`} locale={locale}>
                    <Link>
                      <VStack
                        alignItems={"start"}
                        textAlign={"left"}
                        spacing={0}
                        pl={2}
                      >
                        <Text casing={"uppercase"} fontWeight={"bold"}>
                          {t(`other|${test.name}`)} (
                          {t("{{count}} tasks", { count: test._count.tasks })})
                        </Text>
                        <Text>{t(`other|${test.description}`)}</Text>
                      </VStack>
                    </Link>
                  </NextLink>
                </ListItem>
              );
            })}
          </List>
        </VStack>
      </Box>
    </CenteredContainer>
  );
};
export default Tests;
