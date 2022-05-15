import React from "react";

import dynamic from "next/dynamic";
import { TestGenerationSceneInitializer } from "@components/Games/TestGenerationSceneInitializer";

const Test = dynamic(() => import("@components/Games/Test"), { ssr: false });

function App() {
  return (
    <div style={{ flex: 1, display: "flex", position: "relative" }}>
      <Test SceneFactory={TestGenerationSceneInitializer} />
    </div>
  );
}

export default App;
