import { Center } from "@chakra-ui/react";
import { PHQ9 } from "@components/forms/PHQ9";
import axios from "axios";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/dist/client/router";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import {
  getFirstDepressionTest,
  getFirstEmotionTest,
  getFirstMentalRotationTest,
} from "@utils/status/statusHelpers";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session?.user)
    return {
      redirect: {
        destination: `/${context.locale}/`,
        permanent: false,
      },
    };

  const completedItems = await Promise.all([
    getFirstEmotionTest(session.user.id),
    getFirstMentalRotationTest(session.user.id),
    getFirstDepressionTest(session.user.id),
  ]);

  if (!completedItems[0] || !completedItems[1] || !!completedItems[2])
    return {
      redirect: {
        destination: `/${context.locale}/status`,
        permanent: false,
      },
    };

  return {
    props: {
      session,
    },
  };
};

export default function Phq9() {
  const router = useRouter();

  return (
    <Center minHeight={"100vh"} p={5}>
      <PHQ9
        onSubmit={async (values) => {
          await axios.post("/api/tests/completeAdditionalTest", {
            data: values,
            type: "PHQ9",
          } as Pick<Prisma.AdditionalTestUncheckedCreateInput, "type" | "data">);
          router.push("/status", "/status", { locale: router.locale });
        }}
      />
    </Center>
  );
}
