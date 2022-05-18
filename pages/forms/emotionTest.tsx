import { Center } from "@chakra-ui/react";
import { EmotionWheel } from "@components/forms/EmotionWheel";
import axios from "axios";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/dist/client/router";

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
