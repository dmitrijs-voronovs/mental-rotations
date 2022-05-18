import { FC, useEffect } from "react";
import { Prisma, Task, Test } from "@prisma/client";
import {
  Box,
  Center,
  Heading,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { TUTORIAL_TEST } from "../config/testNames";
import NextLink from "next/link";
import { useRouter } from "next/dist/client/router";

const timeFmt = new Intl.NumberFormat();

export const TestResults: FC<{
  test: Test & { tasks: Task[] };
  data: Prisma.CompletedTaskCreateWithoutTestInput[];
}> = ({ test, data }) => {
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

      axios
        .post("/api/tests/complete", completedTest)
        .then(console.log)
        .catch(console.error);
    }
    // eslint-disable-next-line
  }, []);
  return (
    <Center>
      <Box w={"xl"}>
        <Heading fontSize={"3xl"} pb={"2rem"}>
          Hooray! Test completed.
        </Heading>
        <Heading fontSize={"xl"} pb={"1rem"}>
          Your results:
        </Heading>
        <TableContainer mb={"1rem"}>
          <Table variant="simple" size={"sm"}>
            <Thead>
              <Tr>
                <Th>Task No.</Th>
                <Th>Time (sec)</Th>
                <Th>Correct</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map(({ time, correct }, i) => (
                <Tr key={i}>
                  <Td>{i + 1}</Td>
                  <Td>{timeFmt.format(time)}</Td>
                  <Td>{correct ? "YES" : "NO"}</Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>Total:</Th>
                <Th textTransform={"lowercase"}>
                  {timeFmt.format(
                    data.reduce((totalTime, d) => totalTime + d.time, 0)
                  ) + " sec"}
                </Th>
                <Th>
                  {data.reduce(
                    (totalCorrect, d) => totalCorrect + Number(d.correct),
                    0
                  )}
                  /{data.length}
                </Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
        {test.name === TUTORIAL_TEST ? (
          <NextLink href={"/tests"} locale={router.locale}>
            <Link m={"1rem"}>Go back to the real test</Link>
          </NextLink>
        ) : (
          <NextLink href={"/status"} locale={router.locale}>
            <Link m={"1rem"}>Go back to main menu</Link>
          </NextLink>
        )}
      </Box>
    </Center>
  );
};
