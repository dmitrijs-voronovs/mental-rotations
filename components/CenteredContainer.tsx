import { FC } from "react";
import { Center, CenterProps } from "@chakra-ui/react";
import { Navbar, NAVBAR_HEIGHT } from "@components/Navbar";
import { Footer, FOOTER_HEIGHT } from "@components/Footer";

export const CenteredContainer: FC<
  CenterProps & { showNavbar?: boolean; showFooter?: boolean }
> = ({ showFooter = false, showNavbar = false, children, ...rest }) => {
  const navbarHeight = showNavbar ? NAVBAR_HEIGHT : "0px";
  const footerHeight = showFooter ? FOOTER_HEIGHT : "0px";
  return (
    <Center
      minHeight={`calc(100vh - ${navbarHeight} - ${footerHeight})`}
      p={5}
      mt={navbarHeight}
      mb={footerHeight}
      {...rest}
    >
      {showNavbar && <Navbar />}
      {children}
      {showFooter && <Footer />}
    </Center>
  );
};
