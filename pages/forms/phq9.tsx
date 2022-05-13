import { Center } from "@chakra-ui/react";
import { PHQ9 } from "@components/forms/PHQ9";

export default function phq9() {
  return (
    <Center minHeight={"100vh"} p={5}>
      <PHQ9 />
    </Center>
  );
}
