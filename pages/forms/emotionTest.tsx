import {Center} from "@chakra-ui/react";
import {EmotionWheel} from "@components/forms/EmotionWheel";
import axios from "axios";
import {Prisma} from "@prisma/client";
import {useRouter} from "next/dist/client/router";
import {GetServerSideProps} from "next";
import {getSession} from "next-auth/react";
import {getFirstEmotionTest} from "@utils/status/statusHelpers";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

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

  if (completedBefore)
    return {
      redirect: {
        destination: `/${context.locale}/status`,
        permanent: false,
      },
    };

  return {
    props: {
      ...(await serverSideTranslations(context.locale!, [
        "common",
        "emotions",
      ])),
      session,
    },
  };
};

export default function EmotionTest() {
  const router = useRouter();
  return (
    <Center minHeight={"100vh"} p={5}>
      <EmotionWheel
        onSubmit={async (values) => {
          await axios.post("/api/tests/completeAdditionalTest", {
            data: values,
            type: "EMOTION_WHEEL",
          } as Pick<Prisma.AdditionalTestUncheckedCreateInput, "type" | "data">);
          router.push("/status", "/status", { locale: router.locale });
        }}
      />
    </Center>
  );
}
