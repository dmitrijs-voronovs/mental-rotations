import React from "react";
import { ChakraProvider } from "@chakra-ui/react";

import dynamic from "next/dynamic";

const Game4 = dynamic(() => import("@components/Games/Game4"), { ssr: false });
function App() {
  return (
    <ChakraProvider>
      <div style={{ flex: 1, display: "flex", position: "relative" }}>
        <Game4 />
      </div>
    </ChakraProvider>
  );
}

export default App;
