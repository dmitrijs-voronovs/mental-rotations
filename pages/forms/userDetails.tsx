import { UserDetailsForm } from "@components/forms/UserDetailsForm";
import axios from "axios";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "@lib/prisma";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/dist/client/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { reloadSession } from "@utils/reloadSession";
import { NavbarCenter } from "@components/NavbarCenter";

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
      ...(await serverSideTranslations(context.locale!, ["common"])),
    },
  };
};

export default function UserDetails({
  userDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  return (
    <NavbarCenter>
      <UserDetailsForm
        onSubmit={async (value) => {
          await axios.post("/api/users/details", {
            info: value,
          } as Partial<Prisma.UserInfoCreateInput>);
          reloadSession();
          router.push("/status", "/status", { locale: router.locale });
        }}
        initialValues={userDetails?.info}
      />
    </NavbarCenter>
  );
}
