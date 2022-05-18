import { useRouter } from "next/dist/client/router";
import { Box, Heading, HStack, Link } from "@chakra-ui/react";
import NextLink from "next/link";

export function Navbar() {
  const router = useRouter();
  return (
    <Box
      pos={"absolute"}
      top={0}
      background={"purple.50"}
      p={15}
      borderBottomRadius={"8px"}
    >
      <HStack spacing={20} mx={10}>
        <NextLink href={"/"} locale={router.locale}>
          <Link>Home</Link>
        </NextLink>
        <NextLink href={"/status"} locale={router.locale}>
          <Link>Status</Link>
        </NextLink>
        <Heading>PSVT:R</Heading>
        {/*<Image src={"/icon-192x192.png"} w={10} h={10} />*/}
        <NextLink href={"/userInfo"} locale={router.locale}>
          <Link>User Info</Link>
        </NextLink>
        <NextLink href={"/api/auth/signout"} locale={router.locale}>
          <Link>Logout</Link>
        </NextLink>
      </HStack>
    </Box>
  );
}
