import { Center } from "@chakra-ui/react";
import { EmotionWheel } from "@components/forms/EmotionWheel";
import axios from "axios";
import { Prisma } from "@prisma/client";

export default function EmotionTest() {
  return (
    <Center minHeight={"100vh"} p={5}>
      <EmotionWheel
        onSubmit={(values) => {
          axios.post("/api/tests/completeAdditionalTest", {
            data: values,
            type: "EMOTION_WHEEL",
          } as Pick<Prisma.AdditionalTestUncheckedCreateInput, "type" | "data">);
        }}
      />
    </Center>
  );
}
