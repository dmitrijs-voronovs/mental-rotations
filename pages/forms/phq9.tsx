import { Center } from "@chakra-ui/react";
import { PHQ9 } from "@components/forms/PHQ9";
import axios from "axios";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/dist/client/router";

export default function Phq9() {
  const router = useRouter();

  return (
    <Center minHeight={"100vh"} p={5}>
      <PHQ9
        onSubmit={(values) => {
          axios.post("/api/tests/completeAdditionalTest", {
            data: values,
            type: "PHQ9",
          } as Pick<Prisma.AdditionalTestUncheckedCreateInput, "type" | "data">);
          router.push("/status", "/status", { locale: router.locale });
        }}
      />
    </Center>
  );
}
