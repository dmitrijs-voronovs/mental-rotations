import { FC } from "react";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { Box, Heading, Text } from "@chakra-ui/react";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      session: await getSession(ctx),
    },
  };
};

const UserInfo: FC = () => {
  const session = useSession();
  if (!session) return <Heading>User is not logged in</Heading>;

  return (
    <Box>
      <Heading>Your id is {session.data?.user.id}</Heading>
      <Heading fontSize={"md"}>Other info:</Heading>
      <Text>${JSON.stringify(session.data)}</Text>
    </Box>
  );
};

export default UserInfo;
