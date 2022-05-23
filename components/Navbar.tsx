import { useRouter } from "next/dist/client/router";
import { Box, Flex, Heading, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useTranslation } from "next-i18next";

export const NAVBAR_HEIGHT = "75px";

export function Navbar() {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <Box
      pos={"fixed"}
      top={0}
      background={"purple.50"}
      p={15}
      borderBottomRadius={"8px"}
      color={"purple"}
      fontSize={20}
      zIndex={999}
      h={NAVBAR_HEIGHT}
    >
      <Flex
        justifyContent={"space-evenly"}
        alignItems={"center"}
        minW={["md", "lg", "xl"]}
      >
        <NextLink href={"/"} locale={router.locale}>
          <Link>{t("Home")}</Link>
        </NextLink>
        <NextLink href={"/status"} locale={router.locale}>
          <Link>{t("Status")}</Link>
        </NextLink>
        <Heading>{t("PSVT:RR")}</Heading>
        <NextLink href={"/userInfo"} locale={router.locale}>
          <Link>{t("User Info")}</Link>
        </NextLink>
        <NextLink
          href={`/api/auth/signout?callbackUrl=/${router.locale}`}
          locale={""}
        >
          <Link>{t("Logout")}</Link>
        </NextLink>
      </Flex>
    </Box>
  );
}
