import React, { FC } from "react";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { prisma } from "@lib/prisma";
import {
  AdditionalTest,
  CompletedTask,
  CompletedTest,
  UserInfo,
} from "@prisma/client";
import { Button, Divider, Heading, Text, VStack } from "@chakra-ui/react";
import NextLink from "next/link";
import { CenteredContainer } from "@components/CenteredContainer";
import { TestResults } from "@components/TestResults";
import { useTranslation } from "next-i18next";
import { getResults } from "@components/forms/PHQ9";
import { JsonObject } from "type-fest";
import { getOverview } from "@components/forms/EmotionWheel";

function getFirstEmotionTest(userId: string) {
  return prisma.additionalTest.findFirst({
    where: {
      userId,
      type: "EMOTION_WHEEL",
    },
  });
}

function getFirstMentalRotationTest(userId: string) {
  return prisma.completedTest.findFirst({
    where: {
      userId,
    },
    include: {
      tasks: true,
    },
  });
}

function getFirstDepressionTest(userId: string) {
  return prisma.additionalTest.findFirst({
    where: {
      userId,
      type: "PHQ9",
    },
  });
}

function getUserInfo(userId: string) {
  return prisma.userInfo.findFirst({
    where: {
      userId,
    },
  });
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userId = context.params!.id as string;
  const [emotions, mentalRotations, depression, userInfo] = await Promise.all([
    getFirstEmotionTest(userId),
    getFirstMentalRotationTest(userId),
    getFirstDepressionTest(userId),
    getUserInfo(userId),
  ]);

  return {
    props: {
      emotions: JSON.parse(JSON.stringify(emotions)),
      mentalRotations: JSON.parse(JSON.stringify(mentalRotations)),
      depression: JSON.parse(JSON.stringify(depression)),
      userInfo: JSON.parse(JSON.stringify(userInfo)),
      locale: context.locale,
      ...(await serverSideTranslations(context.locale!, ["common"])),
    },
  };
};

function NotCompleted() {
  const { t } = useTranslation();
  return <Text>{t("Not completed yet")}</Text>;
}

const UserData: FC<{
  emotions: AdditionalTest | null;
  mentalRotations: (CompletedTest & { tasks: CompletedTask[] }) | null;
  depression: AdditionalTest | null;
  userInfo: UserInfo | null;
  locale: string;
}> = ({ emotions, mentalRotations, depression, userInfo, locale }) => {
  const { t } = useTranslation();
  return (
    <CenteredContainer flexDirection={"column"}>
      <Heading mb={8}>{t("User data")}</Heading>
      <VStack direction={"column"} spacing={8}>
        {userInfo && (
          <VStack>
            <Heading size={"md"}>{t("User info")}</Heading>
            <pre>
              {JSON.stringify(
                {
                  id: userInfo.userId,
                  testGroup: userInfo.testGroup,
                  ...(userInfo.info as JsonObject),
                },
                null,
                2
              )}
            </pre>
          </VStack>
        )}
        <Divider />
        <VStack>
          <Heading size={"md"}>{t("Emotions")}</Heading>
          {emotions ? (
            <VStack>
              {Object.entries(
                getOverview(emotions.data as Record<string, number>)
              ).map(([title, score]) => (
                <Text key={title}>
                  <b>{t(title)}:</b> {score}
                </Text>
              ))}
            </VStack>
          ) : (
            <NotCompleted />
          )}
        </VStack>
        <Divider />
        <VStack>
          <Heading size={"md"}>{t("Mental rotations")}</Heading>
          {mentalRotations ? (
            <TestResults data={mentalRotations.tasks} />
          ) : (
            <NotCompleted />
          )}
        </VStack>
        <Divider />
        <VStack>
          <Heading size={"md"}>{t("Depression")}</Heading>
          {depression ? (
            <Text maxW={"sm"} textAlign={"center"}>
              <Text>
                {t("Your score is")}: {(depression.data as JsonObject)!.total}
              </Text>
              <Text>
                {getResults(
                  Number((depression.data as JsonObject)!.total) || 0
                )}
              </Text>
            </Text>
          ) : (
            <NotCompleted />
          )}
        </VStack>
      </VStack>
      <NextLink href={"/data/users"} locale={locale}>
        <Button mt={8} mb={5}>
          {t("Go back")}
        </Button>
      </NextLink>
    </CenteredContainer>
  );
};

export default UserData;
