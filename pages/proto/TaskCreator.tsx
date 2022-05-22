import React from "react";

import dynamic from "next/dynamic";
import {TestGenerationSceneInitializer} from "@utils/SceneHelpers/SceneInitializer/TestGenerationSceneInitializer";
import {GetServerSideProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: { ...(await serverSideTranslations(context.locale!, ["common"])) },
  };
};

const Test = dynamic(() => import("@components/Games/Test"), { ssr: false });

function App() {
  return (
    <div style={{ flex: 1, display: "flex", position: "relative" }}>
      <Test SceneFactory={TestGenerationSceneInitializer} />
    </div>
  );
}

export default App;
