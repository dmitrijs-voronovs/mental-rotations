import { GetServerSideProps } from "next";
import { prisma } from "@lib/prisma";
import { FC, useState } from "react";
import { Task, Test } from "@prisma/client";
import { Box, Heading, Kbd, Text } from "@chakra-ui/react";
import { BOTTOM_ROW_ID, TEST_OBJ_ID, TOP_ROW_ID } from "@components/TestTask";
import { getSession } from "next-auth/react";
import { getFirstEmotionTest } from "@utils/status/statusHelpers";
import ReactJoyride, {
  ACTIONS,
  CallBackProps,
  STATUS,
  Step,
} from "react-joyride";
import { PregeneratedTestRunner } from "@components/PregeneratedTestRunner";
import { TUTORIAL_TEST } from "../../config/testNames";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import dynamic from "next/dynamic";

const RotateDeviceOverlay = dynamic(
  async () =>
    (await import("@components/RotateDeviceOverlay")).RotateDeviceOverlay,
  {
    ssr: false,
  }
);

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
    props: {
      test: JSON.parse(JSON.stringify(test)),
      session,
      ...(await serverSideTranslations(context.locale!, ["common", "other"])),
    },
  };
};

export type TestDetailsProps = {
  test: (Test & { tasks: Task[] }) | null;
};

const TestDetails: FC<TestDetailsProps> = ({ test }) => {
  const { t } = useTranslation();
  const [joyride, setJoyride] = useState<{ run: boolean; steps: Array<Step> }>({
    steps: [
      {
        target: "body",
        placement: "center",
        title: <Heading fontSize={"xl"}>{t("Object Rotation")}</Heading>,
        content: (
          <Text>
            {t(
              "The exercise tests your ability to rotate mental representations of three-dimensional objects."
            )}
            <br />
            <br />
            {t("But how does it work?")}
          </Text>
        ),
      },
      {
        target: `#${TOP_ROW_ID}`,
        placement: "bottom",
        content: (
          <Text fontSize={"sm"}>
            {t(
              "The reference object is presented in the first row before (on the left) and after (on the right) the rotation is applied."
            )}
            <br />
            <br />
            {t("In this case it is")}{" "}
            <b>{t("a single 90 degree rotation counterclockwise")}</b>.
          </Text>
        ),
      },
      {
        target: `#${TEST_OBJ_ID}`,
        placement: "left",
        content: (
          <Text>
            {t("This is the target object.")}
            <br />
            {t(
              "Your goal is to perform the same rotation on this object mentally."
            )}
          </Text>
        ),
      },
      {
        target: `#${BOTTOM_ROW_ID}`,
        placement: "top",
        content: (
          <Text>
            {t("And pick the correct result out of 5.")}
            <br />
            {t(
              "You can either click on the resulting object or use your keyboard buttons"
            )}{" "}
            <Kbd>1</Kbd> - <Kbd>5</Kbd>.
          </Text>
        ),
      },
      {
        target: "body",
        placement: "center",
        title: <Heading fontSize={"xl"}>{t("Now you are ready")}</Heading>,
        content: <Text>{t("Good luck!")}</Text>,
      },
    ],
    run: false,
  });

  const joyrideCallback = (data: CallBackProps): void => {
    const { status, action } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status) || action === ACTIONS.RESET) {
      setJoyride((s) => ({ ...s, run: false }));
    }
  };

  return (
    <Box overflow={"hidden"}>
      <RotateDeviceOverlay />
      <PregeneratedTestRunner
        test={test}
        start={() => setJoyride((s) => ({ ...s, run: true }))}
      />
      {/* TODO: use locale prop */}
      {test?.name === TUTORIAL_TEST && (
        <ReactJoyride
          scrollToFirstStep
          // disableScrolling
          steps={joyride.steps}
          callback={joyrideCallback}
          // continuous
          run={joyride.run}
          locale={{
            back: t("back"),
            close: t("close"),
            last: t("last"),
            next: t("next"),
            open: t("open"),
            skip: t("skip"),
          }}
          showProgress
          showSkipButton
          styles={{
            // tooltip: {
            //   transform: "scale(.5)",
            // },
            options: {
              zIndex: 10000,
            },
          }}
        />
      )}
    </Box>
  );
};

export default TestDetails;
