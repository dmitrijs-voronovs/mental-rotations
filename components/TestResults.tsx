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

const timeFmt = new Intl.NumberFormat();

export const TestResults: FC<{
  test: Test & { tasks: Task[] };
  data: Prisma.CompletedTaskCreateWithoutTestInput[];
}> = ({ test, data }) => {
  const user = useSession();
  // const saveData =
  useEffect(() => {
    if (test.name === TUTORIAL_TEST) return;
    console.log("sending");
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

      const res = axios
        .post("/api/tests/complete", completedTest)
        .then(console.log)
        .catch(console.error);
    }
    // eslint-disable-next-line
  }, []);
  // submit results here
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
                <Th>Time</Th>
                <Th>Correct</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map(({ time, correct }, i) => (
                <Tr key={i}>
                  <Td>{i + 1}</Td>
                  {/*<Td>{time}</Td>*/}
                  <Td>{timeFmt.format(time)}</Td>
                  <Td>{correct ? "YES" : "NO"}</Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>Total:</Th>
                <Th>
                  {timeFmt.format(
                    data.reduce((totalTime, d) => totalTime + d.time, 0)
                  )}
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
        <Link href={"/tests"} m={"1rem"}>
          Go back to tests
        </Link>
      </Box>
    </Center>
  );
};
