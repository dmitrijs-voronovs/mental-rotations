import { Center } from "@chakra-ui/react";
import { PHQ9 } from "@components/forms/PHQ9";
import axios from "axios";
import { Prisma } from "@prisma/client";

export default function phq9() {
  return (
    <Center minHeight={"100vh"} p={5}>
      <PHQ9
        onSubmit={(values) => {
          axios.post("/api/tests/completeAdditionalTest", {
            data: values,
            type: "PHQ9",
          } as Pick<Prisma.AdditionalTestUncheckedCreateInput, "type" | "data">);
        }}
      />
    </Center>
  );
}
