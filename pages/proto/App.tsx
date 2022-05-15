import React from "react";

import dynamic from "next/dynamic";
import { DynamicSceneInitializer } from "@components/Games/DynamicSceneInitializer";

const Test = dynamic(() => import("@components/Games/Test"), { ssr: false });
function App() {
  return (
    <div style={{ flex: 1, display: "flex", position: "relative" }}>
      <Test SceneFactory={DynamicSceneInitializer} />
    </div>
  );
}

export default App;
