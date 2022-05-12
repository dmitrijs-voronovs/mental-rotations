import React from "react";

import dynamic from "next/dynamic";

const Test = dynamic(() => import("@components/Games/Test"), { ssr: false });
function App() {
  return (
    <div style={{ flex: 1, display: "flex", position: "relative" }}>
      <Test />
    </div>
  );
}

export default App;
