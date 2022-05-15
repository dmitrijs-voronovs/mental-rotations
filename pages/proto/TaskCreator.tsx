import React from "react";

import dynamic from "next/dynamic";
import { TestGenerationSceneFactory } from "@components/Games/TestGenerationSceneFactory";

const Test = dynamic(() => import("@components/Games/Test"), { ssr: false });

function App() {
  return (
    <div style={{ flex: 1, display: "flex", position: "relative" }}>
      <Test SceneFactory={TestGenerationSceneFactory} />
    </div>
  );
}

export default App;
