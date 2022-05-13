import { UserDetailsForm } from "@components/forms/UserDetailsForm";
import { Center } from "@chakra-ui/react";

export default function NewUser() {
  return (
    <Center minHeight={"100vh"} p={5}>
      <UserDetailsForm />
    </Center>
  );
}
