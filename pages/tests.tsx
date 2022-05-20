import { GetServerSideProps } from "next";
import {
  Box,
  Center,
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
import { Navbar } from "@components/Navbar";
import NextLink from "next/link";
import { FC } from "react";
import { Test } from "@prisma/client";

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
    props: { tests, locale: context.locale },
  };
};

const Tests: FC<{
  tests: (Test & { _count: { tasks: number } })[];
  locale: string | undefined;
}> = ({ tests, locale }) => {
  return (
    <Center width={"100vw"} height={"100vh"}>
      <Navbar />
      <Box maxW={"xl"} textAlign={"center"} mt={-10}>
        <VStack spacing={5}>
          <Heading textTransform={"uppercase"}>Object rotation</Heading>
          <Text fontSize={"xl"} pb={3}>
            Please, start with the tutorial to understand the object rotation
            specifics. Then proceed to the real exercise!
          </Text>
          <List spacing={4}>
            {tests.map((t) => {
              return (
                <ListItem
                  key={t.id}
                  display={"flex"}
                  alignItems={"center"}
                  p={3}
                  borderRadius={"5px"}
                  _hover={{ background: "purple.50" }}
                >
                  <NextLink href={`/tests/${t.id}`} locale={locale}>
                    <Link>
                      <VStack alignItems={"start"} spacing={0} pl={2}>
                        <Text casing={"uppercase"} fontWeight={"bold"}>
                          {t.name} ({t._count.tasks} tasks)
                        </Text>
                        <Text>{t.description}</Text>
                      </VStack>
                    </Link>
                  </NextLink>
                </ListItem>
              );
            })}
          </List>
        </VStack>
      </Box>
    </Center>
  );
};
export default Tests;
