import { FC, useEffect, useRef, useState } from "react";
import { Box, Kbd, useToast } from "@chakra-ui/react";
import { ExportToCsv } from "export-to-csv";
import { GenerationConfig } from "../utils/GenerateFigure";
import {
  ActualAnswer,
  CorrectAnswer,
  Help,
  listenToProjectEvents,
  Print,
  removeProjectEventListener,
} from "../utils/Events";

type PersistentGenerationConfig = Omit<
  GenerationConfig,
  "originX" | "originY" | "originZ" | "showAxis"
>;

type PersistentReferenceGenerationConfig = {
  [Key in keyof PersistentGenerationConfig as `reference-${Key}`]: PersistentGenerationConfig[Key];
};
type PersistentTargetGenerationConfig = {
  [Key in keyof PersistentGenerationConfig as `target-${Key}`]: PersistentGenerationConfig[Key];
};

export type TestResult = {
  time: number;
  correct: boolean;
};
// & PersistentReferenceGenerationConfig &
//   PersistentTargetGenerationConfig;

const formatConfig = <T extends "reference" | "target">(
  config: GenerationConfig,
  type: T
): T extends "reference"
  ? PersistentReferenceGenerationConfig
  : PersistentTargetGenerationConfig => {
  const keysToOmit = ["originX", "originY", "originZ", "showAxis"];
  const result = Object.entries(config).reduce((res, [k, v]) => {
    if (!keysToOmit.includes(k)) {
      const key = `${
        type === "reference" ? "reference" : "target"
      }-${k}` as keyof (
        | PersistentReferenceGenerationConfig
        | PersistentTargetGenerationConfig
      );
      // @ts-ignore
      res[key] = v;
    }
    return res;
  }, {} as PersistentTargetGenerationConfig | PersistentReferenceGenerationConfig);
  // current workaround
  return result as any;
};

export type TestResults = TestResult[];

const exportOptions = {
  fieldSeparator: ",",
  quoteStrings: '"',
  decimalSeparator: ".",
  showLabels: true,
  showTitle: true,
  title: "Test Results",
  useTextFile: false,
  useBom: true,
  useKeysAsHeaders: true,
};

function exportTestResults(results: TestResults) {
  const csvExporter = new ExportToCsv(exportOptions);
  csvExporter.generateCsv(results);
}

export const EventDisplay: FC = (props) => {
  const toast = useToast();
  const [correct, setCorrect] = useState(-1);
  const [showHelp, setShowHelp] = useState(false);
  const data = useRef<TestResults>(null);

  useEffect(() => {
    const correctAnswerHandler = (e: CorrectAnswer) => {
      setCorrect(e.detail);
    };

    const helpHandler = () => {
      setShowHelp((help) => !help);
    };

    function printHandler(e: Print) {
      exportTestResults(
        data.current || [
          {
            time: Date.now(),
            correct: true,
          },
        ]
      );
    }

    listenToProjectEvents("correctAnswer", correctAnswerHandler);
    listenToProjectEvents("help", helpHandler);
    listenToProjectEvents("print", printHandler);
    return () => {
      removeProjectEventListener("correctAnswer", correctAnswerHandler);
      removeProjectEventListener("print", printHandler);
    };
  }, []);

  useEffect(() => {
    const actualAnswerHandler = (e: ActualAnswer) => {
      console.log(correct, e);
      if (correct === e.detail) {
        toast({
          status: "success",
          position: "top-right",
          title: "Correct!",
        });
      } else {
        toast({
          status: "error",
          position: "top-right",
          title: "Wrong answer :(",
        });
      }
    };

    listenToProjectEvents("actualAnswer", actualAnswerHandler);
    return () => {
      removeProjectEventListener("actualAnswer", actualAnswerHandler);
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
