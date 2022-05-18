import { GetServerSideProps } from "next";
import { prisma } from "@lib/prisma";
import { FC, useEffect, useRef, useState } from "react";
import { CompletedTest, Prisma, Task, Test } from "@prisma/client";
import {
  Box,
  Button,
  Heading,
  Link,
  ListItem,
  Progress,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import { TestTask } from "@components/TestTask";
import { launchTimer, Timer } from "@utils/LaunchTimer";
import { TestResults } from "@components/TestResults";
import { getSession } from "next-auth/react";
import { TestScreenshots } from "@components/EventDisplay";
import { getFirstEmotionTest } from "@utils/status/statusHelpers";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session?.user)
    return {
      redirect: {
        destination: `/${context.locale}/`,
        permanent: false,
      },
    };

  const completedBefore = await getFirstEmotionTest(session.user.id);

  if (!completedBefore)
    return {
      redirect: {
        destination: `/${context.locale}/status`,
        permanent: false,
      },
    };

  const id = context.params!.id as string;
  const test = await prisma.test.findUnique({
    where: { id },
    include: {
      tasks: true,
      completedTests: true,
    },
  });

  return {
    props: { test: JSON.parse(JSON.stringify(test)), session },
  };
};

const TestDetails: FC<{
  test: (Test & { tasks: Task[]; completedTests: CompletedTest[] }) | null;
}> = ({ test }) => {
  const [taskIdx, setTaskIdx] = useState(-1);
  const [results, setResults] = useState<
    Prisma.CompletedTaskCreateWithoutTestInput[]
  >([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const timer = useRef<Timer>();
  const router = useRouter();

  useEffect(() => {
    timer.current = launchTimer();
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onItemClick = (n: number) => {
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

  useEffect(() => {
    function loadTaskImages(imgNames: TestScreenshots) {
      Object.entries(imgNames).forEach(([name, src]) => {
        if (name === "scene") return;
        const img = new Image();
        img.src = src;
        img.onload = (_e) => {
          setLoadingProgress((old) => old + 1);
        };
      });
    }

    if (test) {
      test.tasks.forEach((task) =>
        loadTaskImages(task.images as TestScreenshots)
      );
    }
  }, [test]);

  if (!test) {
    router.push("/tests");
    return null;
  }

  const testImageCount =
    test.tasks.length *
    (Object.values(test.tasks[0].images as TestScreenshots).length - 1);

  if (taskIdx < 0)
    return (
      <VStack>
        <Heading>{test.name}</Heading>
        <p>Test consists of {test.tasks.length} tasks</p>
        <Box>
          <Heading fontSize={"md"}>
            Loading test data {loadingProgress}/{testImageCount}
          </Heading>
          <Progress
            size={"md"}
            value={loadingProgress}
            min={0}
            max={testImageCount}
          />
        </Box>
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
        <Button
          disabled={loadingProgress !== testImageCount}
          variant="solid"
          onClick={() => setTaskIdx(0)}
        >
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
