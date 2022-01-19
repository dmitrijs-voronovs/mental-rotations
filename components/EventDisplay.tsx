import { FC, useEffect, useState } from "react";
import { Box, Kbd, useToast } from "@chakra-ui/react";
import {
  DataActualShapeNumber_Data,
  DataActualShapeNumberE,
  DataCorrectShapeNumber_Data,
  DataCorrectShapeNumberE,
  HelpE,
} from "../utils/Events";

export const EventDisplay: FC = (props) => {
  const toast = useToast();
  const [correct, setCorrect] = useState(-1);
  const [showHelp, setShowHelp] = useState(false);
  useEffect(() => {
    const correctShapeNumberHandler = (
      e: CustomEvent<DataCorrectShapeNumber_Data>
    ) => {
      console.log(e);
      setCorrect(e.detail);
    };
    const helpHandler = (e: Event) => {
      console.log(e);
      setShowHelp((help) => !help);
    };

    // @ts-ignore
    document.addEventListener(
      DataCorrectShapeNumberE,
      correctShapeNumberHandler
    );
    document.addEventListener(HelpE, helpHandler);
    return () => {
      // @ts-ignore
      document.removeEventListener(
        DataCorrectShapeNumberE,
        correctShapeNumberHandler
      );
      document.removeEventListener(HelpE, helpHandler);
    };
  }, []);

  useEffect(() => {
    const actualShapeNumberHandler = (
      e: CustomEvent<DataActualShapeNumber_Data>
    ) => {
      console.log(correct, e);
      if (correct === e.detail) {
        toast({
          status: "success",
          // description: "Congratulations",
          position: "top-right",
          title: "Correct!",
        });
      } else {
        toast({
          status: "error",
          position: "top-right",
          // description: "This is a wrong answer",
          title: "Wrong answer :(",
        });
      }
    };
    // @ts-ignore
    document.addEventListener(DataActualShapeNumberE, actualShapeNumberHandler);
    // @ts-ignore
    return () => {
      // @ts-ignore
      document.removeEventListener(
        DataActualShapeNumberE,
        actualShapeNumberHandler
      );
    };
  }, [correct]);

  if (showHelp)
    return (
      <Box pos={"absolute"} top={5} left={5}>
        Correct: <Kbd>{correct}</Kbd>
      </Box>
    );

  return null;
};
