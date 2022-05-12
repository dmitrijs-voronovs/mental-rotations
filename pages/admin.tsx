import { useSession } from "next-auth/react";
import { FC } from "react";
import { Box, Text } from "@chakra-ui/react";

const AdminPage = () => {
  return (
    <Admin>
      <h1>Cool</h1>
    </Admin>
  );
};

const Admin: FC = ({ children }) => {
  const { data } = useSession();
  const isAdmin = data?.user.role === "ADMIN";
  console.log();

  return !isAdmin ? <Text>"Only admin can enter"</Text> : <Box>{children}</Box>;
};

export default AdminPage;
