import { GetServerSideProps } from "next";
import { prisma } from "@lib/prisma";
import { FC, useState } from "react";
import { Task, Test } from "@prisma/client";
import { Box, Heading, Kbd, Text } from "@chakra-ui/react";
import { BOTTOM_ROW_ID, TEST_OBJ_ID, TOP_ROW_ID } from "@components/TestTask";
import { getSession } from "next-auth/react";
import { getFirstEmotionTest } from "@utils/status/statusHelpers";
import ReactJoyride, { ACTIONS, CallBackProps, Step } from "react-joyride";
import { PregeneratedTestRunner } from "@components/PregeneratedTestRunner";
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
    },
  });

  return {
    props: { test: JSON.parse(JSON.stringify(test)), session },
  };
};

export type TestDetailsProps = {
  test: (Test & { tasks: Task[] }) | null;
};

const TestDetails: FC<TestDetailsProps> = ({ test }) => {
  const [joyride, setJoyride] = useState<{ run: boolean; steps: Array<Step> }>({
    steps: [
      {
        target: "body",
        placement: "center",
        title: <Heading fontSize={"xl"}>Object Rotation</Heading>,
        content: (
          <Text>
            The exercise tests your ability to rotate mental representations of
            three-dimensional objects.
            <br />
            <br />
            But how does it work?
          </Text>
        ),
      },
      {
        target: `#${TOP_ROW_ID}`,
        placement: "bottom-start",
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

  const joyrideCallback = (data: CallBackProps): void => {
    if (data.action === ACTIONS.CLOSE || data.action === ACTIONS.SKIP) {
      setJoyride((s) => ({ ...s, run: false }));
    }
  };

  return (
    <Box overflow={"hidden"}>
      <PregeneratedTestRunner
        test={test}
        start={() => setJoyride((s) => ({ ...s, run: true }))}
      />
      {/* TODO: use locale prop */}
      {/*  TODO: hide when not a tutorial */}
      {test?.name === TUTORIAL_TEST && (
        <ReactJoyride
          disableScrolling
          steps={joyride.steps}
          callback={joyrideCallback}
          continuous
          run={joyride.run}
          showProgress
          showSkipButton
        />
      )}
    </Box>
  );
};

export default TestDetails;
