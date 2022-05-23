import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import styles from "../styles/Home.module.scss";
import {
  Box,
  Button,
  Heading,
  Image,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/dist/client/router";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ["common"])),
      locale: context.locale,
      session,
    },
  };
};

function ChangeLanguage() {
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

const Home: NextPage = ({
  locale,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { data } = useSession();
  const { t } = useTranslation();
  return (
    <Box className={styles.container} pos={"relative"}>
      <Box
        zIndex={-1}
        pos={"absolute"}
        top={0}
        left={0}
        width={"100%"}
        height={"100%"}
        overflow={"hidden"}
      >
        <Image
          pos={"absolute"}
          alt={"bg"}
          overflow={"hidden"}
          objectFit={"contain"}
          src={"/homepage.png"}
          sx={{ filter: "blur(8px)" }}
          opacity={0.2}
          height={"120%"}
          left={"50%"}
          top={"-10%"}
          transform={"translate(-50%)"}
        />
      </Box>
      <Heading mb={3} mt={-10}>
        {t("Object Rotation")}
      </Heading>
      <Box className={styles.description} maxW={"2xl"}>
        {t(
          "Object mental rotation refers to moving things around in your head. It is one of the numerous visual and spatial skills that we all have."
        )}
      </Box>
      <Button
        onClick={() => {
          if (data?.user) {
            if (data.user.infoFilled) {
              return router.push("/status", "/status", { locale });
            }
            return router.push("/forms/userDetails", "/forms/userDetails", {
              locale,
            });
          }
          signIn(undefined, { callbackUrl: `/${locale}/status` });
        }}
        textTransform={"capitalize"}
        size={"lg"}
        my={10}
      >
        {t("Start")}!
      </Button>

      <VStack position={"absolute"} bottom={5} textAlign={"center"}>
        <ChangeLanguage />
        <Text pt={2}>
          {t("Made by")} <Text as={"b"}>{t("Dmitry Voronov")}</Text>
        </Text>
      </VStack>
    </Box>
  );
};

export default Home;
