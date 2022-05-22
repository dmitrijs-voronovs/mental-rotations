import { FC } from "react";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { Button, Center, Heading, Link, Text, VStack } from "@chakra-ui/react";
import { Navbar } from "@components/Navbar";
import NextLink from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session?.user)
    return {
      redirect: {
        permanent: false,
        destination: `/${context.locale}/auth/signIn`,
      },
    };

  return {
    props: {
      session: session,
      locale: context.locale,
      ...(await serverSideTranslations(context.locale!, ["common"])),
    },
  };
};

const UserInfo: FC<{ locale: string }> = ({ locale }) => {
  const { t } = useTranslation();
  const session = useSession();
  if (!session) return <Heading>{t("User is not logged in")}</Heading>;

  return (
    <Center height={"100vh"}>
      <Navbar />
      <VStack spacing={5} alignItems={"start"} maxW={"lg"} overflow={"clip"}>
        <Heading>{t("User information:")}</Heading>
        <Heading fontSize={"2xl"}>
          {t("Your id is")} <i>{session.data?.user.id}</i>
        </Heading>
        <Text>
          <pre>{JSON.stringify(session.data, null, 2)}</pre>
        </Text>
        <NextLink href={"/forms/newUser"} locale={locale}>
          <Link>
            <Button>{t("Change")}</Button>
          </Link>
        </NextLink>
      </VStack>
    </Center>
  );
};

export default UserInfo;
