import React from "react";
import { ChakraProvider } from "@chakra-ui/react";

import dynamic from "next/dynamic";

const Test = dynamic(() => import("@components/Games/Test"), { ssr: false });
function App() {
  return (
    <ChakraProvider>
      <div style={{ flex: 1, display: "flex", position: "relative" }}>
        <Test />
      </div>
    </ChakraProvider>
  );
}

export default App;
