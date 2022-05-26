import { useTranslation } from "next-i18next";
import { Text, VStack } from "@chakra-ui/react";
import { ChangeLanguage } from "@components/ChangeLanguage";

export function Footer() {
  const { t } = useTranslation();
  return (
    <VStack
      position={"fixed"}
      bottom={0}
      py={5}
      textAlign={"center"}
      width={"100%"}
      background={"whiteAlpha.700"}
    >
      <ChangeLanguage />
      <Text pt={2}>
        {t("Made by")} <Text as={"b"}>{t("Dmitry Voronov")}</Text>
      </Text>
    </VStack>
  );
}

export const FOOTER_HEIGHT = "120px";
