import { FC, useEffect } from "react";
import { Prisma, Task, Test } from "@prisma/client";
import { Box, Center, Heading, Link } from "@chakra-ui/react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { TUTORIAL_TEST } from "../config/testNames";
import NextLink from "next/link";
import { useRouter } from "next/dist/client/router";
import { useTranslation } from "next-i18next";
import { TestResults } from "@components/TestResults";

export const TestCompleted: FC<{
  test: Test & { tasks: Task[] };
  data: Prisma.CompletedTaskCreateWithoutTestInput[];
  showResults?: boolean;
}> = ({ test, data, showResults = false }) => {
  const { t } = useTranslation();
  const user = useSession();
  const router = useRouter();

  useEffect(() => {
    if (test.name === TUTORIAL_TEST) return;
    const userId = user.data?.user.id;
    if (userId) {
      const completedTest: Prisma.CompletedTestCreateInput = {
        user: {
          connect: {
            id: userId,
          },
        },
        test: {
          connect: {
            id: test.id,
          },
        },
        tasks: {
          createMany: {
            data,
          },
        },
      };

      axios.post("/api/tests/complete", completedTest).catch(console.error);
    }
    // eslint-disable-next-line
  }, []);
  return (
    <Center height={"100vh"} width={"100vw"}>
      <Box w={"xl"} textAlign={"center"}>
        <Heading fontSize={"3xl"} pb={"2rem"}>
          {t("Hooray! Exercise completed!")}
        </Heading>
        {showResults ||
          (test.name === TUTORIAL_TEST && <TestResults data={data} />)}
        {test.name === TUTORIAL_TEST ? (
          <NextLink href={"/tests"} locale={router.locale}>
            <Link m={"1rem"}>{t("Go back to the real exercise")}</Link>
          </NextLink>
        ) : (
          <NextLink href={"/status"} locale={router.locale}>
            <Link m={"1rem"}>{t("Go back to main menu")}</Link>
          </NextLink>
        )}
      </Box>
    </Center>
  );
};
