import { FC } from "react";
import { Center, CenterProps } from "@chakra-ui/react";
import { Navbar, NAVBAR_HEIGHT } from "@components/Navbar";

export const NavbarCenter: FC<CenterProps> = ({ children, ...rest }) => {
  return (
    <Center
      minHeight={`calc(100vh - ${NAVBAR_HEIGHT})`}
      p={5}
      mt={NAVBAR_HEIGHT}
      {...rest}
    >
      <Navbar />
      {children}
    </Center>
  );
};
