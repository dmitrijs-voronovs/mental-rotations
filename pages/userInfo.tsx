import { FC } from "react";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { Button, Heading, Link, Text, VStack } from "@chakra-ui/react";
import NextLink from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NavbarCenter } from "@components/NavbarCenter";
import { prisma } from "@lib/prisma";
import type { UserInfo as PrismaUserInfo } from "@prisma/client";
import { UserDetailsFormValues } from "@components/forms/UserDetailsForm";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session?.user)
    return {
      redirect: {
        permanent: false,
        destination: `/${context.locale}/auth/signIn`,
      },
    };

  const info = await prisma.userInfo.findFirst({
    where: {
      userId: session.user.id,
    },
  });

  return {
    props: {
      info,
      session: session,
      locale: context.locale,
      ...(await serverSideTranslations(context.locale!, ["common"])),
    },
  };
};

const UserInfo: FC<{ locale: string; info: PrismaUserInfo }> = ({
  locale,
  info,
}) => {
  const { t } = useTranslation();
  const session = useSession();
  if (!session?.data) return <Heading>{t("User is not logged in")}</Heading>;

  return (
    <NavbarCenter>
      <VStack spacing={5} alignItems={"start"} maxW={"lg"} overflow={"clip"}>
        <Heading>{t("User information:")}</Heading>
        <Heading fontSize={"2xl"}>
          {t("Your id is")} <i>{session.data.user.id}</i>
        </Heading>
        <VStack spacing={3} alignItems={"start"}>
          <Text>
            <b>{t("name")}:</b> {session.data.user.name}
          </Text>
          <Text>
            <b>{t("email")}:</b> {session.data.user.email}
          </Text>
          {info && Object.keys(info).length && (
            <>
              <Text>
                <b>{t("Age")}:</b> {(info.info as UserDetailsFormValues).age}
              </Text>
              <Text>
                <b>{t("Gender")}:</b>{" "}
                {(info.info as UserDetailsFormValues).gender}
              </Text>
              <Text>
                <b>{t("Occupation")}:</b>{" "}
                {(info.info as UserDetailsFormValues).occupation}
              </Text>
              <Text>
                <b>{t("Academic field")}:</b>{" "}
                {(info.info as UserDetailsFormValues).academicField}
              </Text>
            </>
          )}
        </VStack>
        <NextLink href={"/forms/userDetails"} locale={locale}>
          <Link>
            <Button>{t("Change")}</Button>
          </Link>
        </NextLink>
      </VStack>
    </NavbarCenter>
  );
};

export default UserInfo;
