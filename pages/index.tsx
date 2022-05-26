import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import styles from "../styles/Home.module.scss";
import { Box, Button, Heading, Image } from "@chakra-ui/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/dist/client/router";
import { CenteredContainer } from "@components/CenteredContainer";

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

const Home: NextPage = ({
  locale,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { data } = useSession();
  const { t } = useTranslation();
  return (
    <CenteredContainer showFooter flexDir={"column"}>
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
          sx={{ filter: ["blur(2px)", "blur(3px)", "blur(5px)"] }}
          opacity={[0.1, 0.1, 0.15]}
          height={"120%"}
          left={"50%"}
          top={"-10%"}
          transform={[
            "scale(2.2) translate(-20%)",
            "scale(1.5) translate(-30%)",
            "translate(-50%)",
          ]}
        />
      </Box>
      <Heading mb={3}>{t("Object Rotation")}</Heading>
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
    </CenteredContainer>
  );
};

export default Home;
