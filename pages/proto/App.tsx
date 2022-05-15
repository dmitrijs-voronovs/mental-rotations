import React from "react";

import dynamic from "next/dynamic";
import { DynamicSceneFactory } from "@components/Games/DynamicSceneFactory";

const Test = dynamic(() => import("@components/Games/Test"), { ssr: false });
function App() {
  return (
    <div style={{ flex: 1, display: "flex", position: "relative" }}>
      <Test SceneFactory={DynamicSceneFactory} />
    </div>
  );
}

export default App;
