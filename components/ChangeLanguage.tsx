import { useRouter } from "next/dist/client/router";
import { Button, Wrap, WrapItem } from "@chakra-ui/react";

export function ChangeLanguage() {
  const { locale, locales, push, pathname } = useRouter();
  const otherLocales = locales!.filter((l) => l !== locale);

  return (
    <Wrap spacing={5}>
      {otherLocales.map((loc) => (
        <WrapItem key={loc}>
          <Button
            w={"40px"}
            h={"40px"}
            background={"purple.300"}
            fontSize={14}
            borderRadius={"100%"}
            onClick={() => push(pathname, pathname, { locale: loc })}
            textDecoration={"uppercase"}
          >
            {loc}
          </Button>
        </WrapItem>
      ))}
    </Wrap>
  );
}
