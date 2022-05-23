import { useRouter } from "next/dist/client/router";
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  Link,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useTranslation } from "next-i18next";
import { HamburgerIcon } from "@chakra-ui/icons";

export const NAVBAR_HEIGHT = "75px";

export function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useRouter();
  console.log(router);
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
      w={["100%", "auto"]}
    >
      <Flex
        alignItems={"center"}
        justifyContent={"space-between"}
        display={["flex", "none"]}
      >
        <Heading>{t("PSVT:RR")}</Heading>
        <HamburgerIcon onClick={onOpen} />
      </Flex>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Heading color={"purple"}>{t("PSVT:RR")}</Heading>
          </DrawerHeader>
          <DrawerBody>
            <VStack alignItems={"left"} spacing={4} fontSize={20}>
              <NextLink href={"/"} locale={router.locale}>
                <Link
                  textDecoration={router.route === "/" ? "underline" : "none"}
                >
                  {t("Home")}
                </Link>
              </NextLink>
              <NextLink href={"/status"} locale={router.locale}>
                <Link
                  textDecoration={
                    router.route === "/status" ? "underline" : "none"
                  }
                >
                  {t("Status")}
                </Link>
              </NextLink>
              <NextLink href={"/userInfo"} locale={router.locale}>
                <Link
                  textDecoration={
                    router.route === "/userInfo" ? "underline" : "none"
                  }
                >
                  {t("User Info")}
                </Link>
              </NextLink>
              <NextLink
                href={`/api/auth/signout?callbackUrl=/${router.locale}`}
                locale={""}
              >
                <Link>{t("Logout")}</Link>
              </NextLink>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Flex
        justifyContent={"space-evenly"}
        alignItems={"center"}
        minW={["xs", "lg", "xl", "2xl"]}
        display={["none", "flex"]}
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
