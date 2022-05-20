import { UserDetailsForm } from "@components/forms/UserDetailsForm";
import { Center } from "@chakra-ui/react";
import axios from "axios";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "@lib/prisma";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/dist/client/router";
import { Navbar } from "@components/Navbar";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = await getSession(context);
  if (!data?.user)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

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
  const router = useRouter();
  return (
    <Center minHeight={"100vh"} p={5}>
      <Navbar />
      <UserDetailsForm
        onSubmit={async (value) => {
          await axios.post("/api/users/details", {
            info: value,
          } as Partial<Prisma.UserInfoCreateInput>);
          router.push("/status", "/status", { locale: router.locale });
        }}
        initialValues={userDetails?.info}
      />
    </Center>
  );
}
