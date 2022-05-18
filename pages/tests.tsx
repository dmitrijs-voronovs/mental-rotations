import { FC } from "react";
import { Test } from "@prisma/client";
import { GetServerSideProps } from "next";
import { Box, Heading, Link, Text, VStack } from "@chakra-ui/react";
import { prisma } from "@lib/prisma";
import { getSession } from "next-auth/react";

export const TUTORIAL_TEST = "tutorial";
export const REGULAR_TESTS = ["1-easy", "2-easy-2d", "3-easy-isometric"];
export const TEST_NAMES = [...REGULAR_TESTS, TUTORIAL_TEST];

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const tests = await prisma.test.findMany({
    where: {
      name: {
        in: [TUTORIAL_TEST, REGULAR_TESTS[session!.user.testGroupIdx - 1]],
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

  return {
    props: { tests },
  };
};

const Tests: FC<{ tests: (Test & { _count: { tasks: number } })[] }> = ({
  tests,
}) => {
  console.log(tests);
  return (
    <VStack>
      <Heading>Tests</Heading>
      <VStack maxWidth={"2xl"}>
        {tests.map((t) => (
          <Link key={t.id} href={`tests/${t.id}`}>
            <Box
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
              <Heading fontSize="md">
                {t.name} ({t._count.tasks} tasks)
              </Heading>
              <Text mt={4}>{t.description}</Text>
            </Box>
          </Link>
        ))}
      </VStack>
    </VStack>
  );
};
export default Tests;
