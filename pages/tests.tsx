import { FC } from "react";
import { Test } from "@prisma/client";
import { GetServerSideProps } from "next";
import { Box, Heading, Link, Text, VStack } from "@chakra-ui/react";
import { prisma } from "../lib/prisma";

export const getServerSideProps: GetServerSideProps = async () => {
  const tests = await prisma.test.findMany({
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
