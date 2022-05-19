import { GetServerSideProps } from "next";
import { prisma } from "@lib/prisma";
import { FC, MutableRefObject, useEffect, useRef, useState } from "react";
import { CompletedTest, Prisma, Task, Test } from "@prisma/client";
import {
  Box,
  Button,
  Heading,
  Kbd,
  Link,
  ListItem,
  Progress,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import {
  BOTTOM_ROW_ID,
  TEST_OBJ_ID,
  TestTask,
  TOP_ROW_ID,
} from "@components/TestTask";
import { launchTimer, Timer } from "@utils/LaunchTimer";
import { TestResults } from "@components/TestResults";
import { getSession } from "next-auth/react";
import { getFirstEmotionTest } from "@utils/status/statusHelpers";
import { useImagePreloading } from "@utils/hooks/UseImagePreloading";
import ReactJoyride, {
  ACTIONS,
  CallBackProps,
  Step,
  StoreHelpers,
} from "react-joyride";
import { TUTORIAL_TEST } from "../../config/testNames";

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

export type TestDetailsProps = {
  test: (Test & { tasks: Task[]; completedTests: CompletedTest[] }) | null;
};

const TestDetails: FC<TestDetailsProps> = ({ test }) => {
  const [joyride, setJoyride] = useState<{ run: boolean; steps: Array<Step> }>({
    steps: [
      {
        target: "body",
        placement: "center",
        title: <Heading fontSize={"xl"}>Mental Rotation Test</Heading>,
        content: (
          <Text>
            It tests your ability to rotate mental representations of
            two-dimensional and three-dimensional objects.
            <br />
            <br />
            But how does it work?
          </Text>
        ),
      },
      {
        target: `#${TOP_ROW_ID}`,
        placement: "bottom-start",
        // title: "Mental Rotation Test 2",
        content: (
          <Text>
            The reference object is presented in the first row both before (on
            the left) and after (on the right) the rotation is applied.
            <br />
            <br />
            In this case it is a single{" "}
            <b>90 degree rotation counterclockwise</b>.
          </Text>
        ),
      },
      {
        target: `#${TEST_OBJ_ID}`,
        placement: "left",
        // title: "Mental Rotation Test 2",
        content: (
          <Text>
            This is the target object. <br />
            Your goal is to perform the same rotation on this object mentally.
          </Text>
        ),
      },
      {
        target: `#${BOTTOM_ROW_ID}`,
        placement: "top-start",
        disableOverlayClose: true,
        // title: "Mental Rotation Test 2",
        content: (
          <Text>
            And pick the correct result out of 5.
            <br />
            You can either click on the resulting object or use your keyboard
            buttons <Kbd>1</Kbd> to <Kbd>5</Kbd>.
          </Text>
        ),
      },
      {
        target: "body",
        placement: "center",
        title: <Heading fontSize={"xl"}>Now you are ready</Heading>,
        content: <Text>Good luck!</Text>,
      },
    ],
    run: false,
  });
  const helpers = useRef<StoreHelpers>();

  const joyrideCallback = (data: CallBackProps): void => {
    console.log(data);
    if (data.action === ACTIONS.CLOSE || data.action === ACTIONS.SKIP) {
      setJoyride((s) => ({ ...s, run: false }));
    }
  };

  console.log(helpers.current?.info());

  return (
    <Box overflow={"hidden"}>
      <PregeneratedTestRunner
        test={test}
        helpers={helpers}
        start={() => setJoyride((s) => ({ ...s, run: true }))}
      />
      {/* TODO: use locale prop */}
      <ReactJoyride
        disableScrolling
        steps={joyride.steps}
        callback={joyrideCallback}
        continuous
        run={joyride.run}
        showProgress
        getHelpers={(h) => {
          helpers.current = h;
        }}
        showSkipButton
      />
    </Box>
  );
};

export type PregeneratedTestRunnerProps = TestDetailsProps & {
  helpers: MutableRefObject<StoreHelpers | undefined>;
  start: () => void;
};

const PregeneratedTestRunner: FC<PregeneratedTestRunnerProps> = ({
  test,
  helpers,
  start,
}) => {
  const [taskIdx, setTaskIdx] = useState(-1);
  const [results, setResults] = useState<
    Prisma.CompletedTaskCreateWithoutTestInput[]
  >([]);
  const timer = useRef<Timer>();
  const router = useRouter();

  const { total: totalImages, progress: loadedImages } = useImagePreloading({
    test,
  });

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

  if (!test) {
    router.push("/tests");
    return null;
  }

  if (taskIdx < 0)
    return (
      <VStack>
        <Heading>{test.name}</Heading>
        <p>Test consists of {test.tasks.length} tasks</p>
        <Box>
          <Heading fontSize={"md"}>
            Loading test data {loadedImages}/{totalImages}
          </Heading>
          <Progress
            size={"md"}
            value={loadedImages}
            min={0}
            max={totalImages}
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
          disabled={loadedImages !== totalImages}
          variant="solid"
          onClick={() => {
            setTaskIdx(0);
            if (test.name === TUTORIAL_TEST) {
              console.log("here", helpers.current);
              start();
              // helpers.current?.reset(false);
              helpers.current?.open();
              helpers.current?.open();
              helpers.current?.open();
            }
          }}
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
