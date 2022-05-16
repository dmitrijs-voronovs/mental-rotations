import { UserDetailsForm } from "@components/forms/UserDetailsForm";
import { Center } from "@chakra-ui/react";
import axios from "axios";

export default function NewUser() {
  return (
    <Center minHeight={"100vh"} p={5}>
      <UserDetailsForm
        onSubmit={(value) => {
          axios.post("/api/users/details", value);
        }}
      />
    </Center>
  );
}
