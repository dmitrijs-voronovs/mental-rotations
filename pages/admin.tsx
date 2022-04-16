import { useSession } from "next-auth/react";
import { FC, ReactNode } from "react";

const AdminPage = () => {
  return (
    <Admin>
      <h1>Cool</h1>
    </Admin>
  );
};

const Admin: FC<{ children: ReactNode }> = ({ children }) => {
  const { data } = useSession();
  const isAdmin = data?.user.role === "ADMIN";
  console.log();

  return isAdmin ? children : "Only admin can enter";
};

export default AdminPage;
