import { GetServerSideProps } from "next";
import { prisma } from "../../lib/prisma";
import { FC, useEffect, useRef, useState } from "react";
import { CompletedTest, Prisma, Task, Test } from "@prisma/client";
import {
  Box,
  Button,
  Heading,
  Link,
  ListItem,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import { TestTask } from "@components/TestTask";
import { launchTimer, Timer } from "../../utils/LaunchTimer";
import { TestResults } from "@components/TestResults";

export const getServerSideProps: GetServerSideProps = async (req) => {
  const id = req.params!.id as string;
  const test = await prisma.test.findUnique({
    where: { id },
    include: {
      tasks: true,
      completedTests: true,
    },
  });

  return {
    props: { test: JSON.parse(JSON.stringify(test)) },
  };
};

const TestDetails: FC<{
  test: (Test & { tasks: Task[]; completedTests: CompletedTest[] }) | null;
}> = ({ test }) => {
  const [taskIdx, setTaskIdx] = useState(-1);
  const [results, setResults] = useState<
    Prisma.CompletedTaskCreateWithoutTestInput[]
  >([]);
  const timer = useRef<Timer>();
  const router = useRouter();
  console.log(test);
  console.log(results);

  useEffect(() => {
    timer.current = launchTimer();
  });

  const onItemClick = (n: number) => {
    console.log(test, taskIdx, test!.tasks[taskIdx]);
    setResults((res) => [
      ...res,
      {
        answer: n,
        time: timer.current!.stopTimer(),
        correct: n === test!.tasks[taskIdx].correctAnswer,
      },
    ]);
    setTaskIdx((idx) => idx + 1);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const num = Number(e.key);
      if (!isNaN(num) && num >= 0 && num <= 5) {
        onItemClick(num);
      }
    };

    document.addEventListener("keypress", handler);
    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, [onItemClick]);

  if (!test) {
    router.push("/tests");
    return null;
  }

  if (taskIdx < 0)
    return (
      <VStack>
        <Heading>{test.name}</Heading>
        <p>Test consists of {test.tasks.length} tasks</p>
        {test.completedTests.length && (
          <>
            <Heading fontSize={"md"}>Was already completed:</Heading>
            <UnorderedList>
              {test.completedTests.map((t) => (
                <ListItem key={t.id}>
                  {new Date(t.createdAt).toDateString()} -{" "}
                  {new Date(t.createdAt).toLocaleTimeString()}
                </ListItem>
              ))}
            </UnorderedList>
          </>
        )}
        <Button variant="solid" onClick={() => setTaskIdx(0)}>
          Start
        </Button>
      </VStack>
    );

  if (taskIdx < test.tasks.length)
    return (
      <TestTask
        task={test.tasks[taskIdx]}
        taskIdx={taskIdx}
        onClick={onItemClick}
      />
    );

  if (taskIdx === test.tasks.length)
    return <TestResults data={results} test={test} />;

  return (
    <Box>
      <Heading fontSize={"xl"}>Oops, something went wrong</Heading>
      <Link href={"/tests"}>Return back to tests</Link>
    </Box>
  );
};

export default TestDetails;
