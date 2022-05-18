import { FC } from "react";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { Center, Heading, Text, VStack } from "@chakra-ui/react";
import { Navbar } from "@components/Navbar";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (!session?.user)
    return {
      redirect: {
        permanent: false,
        destination: `/${ctx.locale}/auth/signIn`,
      },
    };

  return {
    props: {
      session: session,
    },
  };
};

const UserInfo: FC = () => {
  const session = useSession();
  if (!session) return <Heading>User is not logged in</Heading>;

  return (
    <Center height={"100vh"}>
      <Navbar />
      <VStack spacing={5} alignItems={"start"} maxW={"lg"} overflow={"clip"}>
        <Heading>User information:</Heading>
        <Heading fontSize={"2xl"}>
          Your id is <i>{session.data?.user.id}</i>
        </Heading>
        <Text>
          <pre>{JSON.stringify(session.data, null, 2)}</pre>
        </Text>
      </VStack>
    </Center>
  );
};

export default UserInfo;
