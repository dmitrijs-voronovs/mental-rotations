import { FC, useEffect, useRef, useState } from "react";
import { Prisma } from "@prisma/client";
import { launchTimer, Timer } from "@utils/LaunchTimer";
import { useRouter } from "next/dist/client/router";
import { useImagePreloading } from "@utils/hooks/UseImagePreloading";
import { Box, Button, Heading, Link, Progress, VStack } from "@chakra-ui/react";
import { TUTORIAL_TEST } from "../config/testNames";
import { TestTask } from "@components/TestTask";
import { TestCompleted } from "@components/TestCompleted";
import { TestDetailsProps } from "../pages/tests/[id]";
import { useTranslation } from "next-i18next";
import { CenteredContainer } from "@components/CenteredContainer";

export type PregeneratedTestRunnerProps = TestDetailsProps & {
  start: () => void;
};
export const PregeneratedTestRunner: FC<PregeneratedTestRunnerProps> = ({
  test,
  start,
}) => {
  const { t } = useTranslation(["common", "other"]);
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
      <CenteredContainer showNavbar>
        <VStack spacing={2}>
          <Heading textTransform={"uppercase"}>
            {t(`other|${test.name}`)}
          </Heading>
          <p>
            {t("Exercise consists of {{count}} tasks", {
              count: test.tasks.length,
            })}
          </p>
          <p>{t(`other|${test.description}`)}</p>
          <Box py={5}>
            <Heading fontSize={"md"} mb={4}>
              {t("Loading exercise data")} {loadedImages}/{totalImages}
            </Heading>
            <Progress
              size={"md"}
              value={loadedImages}
              min={0}
              max={totalImages}
            />
          </Box>
          {/* TODO: change query to have only completed tests for the concrete user */}
          {/*{test.completedTests.length && (*/}
          {/*  <>*/}
          {/*    <Heading fontSize={"md"}>Was already completed:</Heading>*/}
          {/*    <UnorderedList>*/}
          {/*      {test.completedTests.map((t) => (*/}
          {/*        <ListItem key={t.id}>*/}
          {/*          {new Date(t.createdAt).toDateString()} -{" "}*/}
          {/*          {new Date(t.createdAt).toLocaleTimeString()}*/}
          {/*        </ListItem>*/}
          {/*      ))}*/}
          {/*    </UnorderedList>*/}
          {/*  </>*/}
          {/*)}*/}
          <Button
            disabled={loadedImages !== totalImages}
            variant="solid"
            onClick={() => {
              setTaskIdx(0);
              if (test.name === TUTORIAL_TEST) {
                start();
              }
            }}
          >
            {t("Start")}
          </Button>
        </VStack>
      </CenteredContainer>
    );

  if (taskIdx < test.tasks.length)
    return (
      <>
        <TestTask
          task={test.tasks[taskIdx]}
          taskIdx={taskIdx}
          onClick={onItemClick}
        />
      </>
    );

  if (taskIdx === test.tasks.length)
    return <TestCompleted data={results} test={test} />;

  return (
    <Box>
      <Heading fontSize={"xl"}>{t("Oops, something went wrong")}</Heading>
      <Link href={"/tests"}>{t("Return back to exercises")}</Link>
    </Box>
  );
};
