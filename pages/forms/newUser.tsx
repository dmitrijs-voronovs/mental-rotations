import { UserDetailsForm } from "@components/forms/UserDetailsForm";
import { Center } from "@chakra-ui/react";
import axios from "axios";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "@lib/prisma";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = await getSession(context);
  return {
    props: {
      userDetails: await prisma.userInfo.findUnique({
        where: {
          userId: data!.user.id,
        },
      }),
    },
  };
};

export default function NewUser({
  userDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Center minHeight={"100vh"} p={5}>
      <UserDetailsForm
        onSubmit={(value) => {
          axios.post("/api/users/details", value);
        }}
        initialValues={userDetails?.info}
      />
    </Center>
  );
}
