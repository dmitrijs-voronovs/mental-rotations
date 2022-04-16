import { FC } from "react";
import { Prisma } from "@prisma/client";
import { GetServerSideProps } from "next";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch("http://localhost:3000/api/tests");
  const tests = await res.json();
  console.log({ tests });
  return {
    props: { tests },
  };
};

const Tests: FC<{ tests: Prisma.TestSelect[] }> = ({ tests }) => {
  return (
    <VStack maxWidth={"2xl"}>
      {tests.map((t) => (
        <Box p={5} shadow="md" borderWidth="1px">
          <Heading fontSize="xl">{t.name}</Heading>
          <Text mt={4}>{t.description}</Text>
          {/*{t.tasks?.map((t) => (*/}
          {/*    <Box p={5} shadow="md" borderWidth="1px">*/}
          {/*      <Heading fontSize="xl">{t.name}</Heading>*/}
          {/*      <Text mt={4}>{t.description}</Text>*/}
          {/*    </Box>*/}
          {/*))}*/}
        </Box>
      ))}
    </VStack>
  );
};
export default Tests;
