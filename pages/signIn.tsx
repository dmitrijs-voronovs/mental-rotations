import { signIn, signOut, useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: { ...(await serverSideTranslations(context.locale!, ["common"])) },
  };
};

export default function Component() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  console.log(session);
  if (session) {
    return (
      <>
        {t("Signed in as")} {session.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      {t("Not signed in")}
      <br />
      <button onClick={() => signIn()}>{t("Sign in")}</button>
    </>
  );
}
