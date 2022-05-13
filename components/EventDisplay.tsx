import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Box, Kbd, useToast } from "@chakra-ui/react";
import { ExportToCsv } from "export-to-csv";
import { GenerationConfig } from "../utils/GenerateFigure";
import {
  ActualAnswer,
  ConfigurationSet,
  CorrectAnswer,
  listenToProjectEvents,
  removeProjectEventListener,
  RotationAnglesSet,
  SceneCreated,
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

export type TestScreenshots = Record<
  | "referenceShape"
  | "referenceShapeRotated"
  | "testShape"
  | "testShape1"
  | "testShape2"
  | "testShape3"
  | "testShape4"
  | "testShape5"
  | "scene",
  string
>;

// TODO: think about IDs?
export type TestResult = {
  time: number;
  correct: boolean;
  correctAnswer: number;
  actualAnswer: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  taskNumber: number;
} & PersistentReferenceGenerationConfig &
  PersistentTargetGenerationConfig &
  TestScreenshots;

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

function exportTestResultsCSV(results: TestResults) {
  const csvExporter = new ExportToCsv(exportOptions);
  csvExporter.generateCsv(results);
}

function exportTestResultsJSON(results: TestResults) {
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(results));
  const a = document.createElement("a");
  a.href = dataStr;
  a.download = "data.json";
  a.click();
}

export const EventDisplay: FC = () => {
  const toast = useToast();
  const [correct, setCorrect] = useState(-1);
  const [showHelp, setShowHelp] = useState(false);
  const data = useRef<TestResults>([]);
  const lastTestData = useRef<Partial<TestResult>>({});

  const updateTestResults = useCallback(() => {
    lastTestData.current.taskNumber = data.current.length + 1;
    data.current.push(lastTestData.current as TestResult);
    lastTestData.current = {};
  }, []);

  useEffect(() => {
    const correctAnswerHandler = (e: CorrectAnswer) => {
      const correctAnswer = e.detail;
      lastTestData.current.correctAnswer = correctAnswer;
      setCorrect(correctAnswer);
    };

    const helpHandler = () => {
      setShowHelp((help) => !help);
    };

    function printHandler() {
      console.log(data.current);
      if (data.current.length) {
        exportTestResultsCSV(data.current);
        exportTestResultsJSON(data.current);
      }
    }

    function sceneCreatedHandler(e: SceneCreated) {
      lastTestData.current = { ...lastTestData.current, ...e.detail };
    }

    function configurationSetHandler(e: ConfigurationSet) {
      const { config, isForReferenceShape } = e.detail;
      const formattedConfig = formatConfig(
        config,
        isForReferenceShape ? "reference" : "target"
      );
      lastTestData.current = { ...lastTestData.current, ...formattedConfig };
    }

    function rotationAnglesSetHandler(e: RotationAnglesSet) {
      const { x: rotationX, y: rotationY, z: rotationZ } = e.detail;
      lastTestData.current = {
        ...lastTestData.current,
        rotationX,
        rotationY,
        rotationZ,
      };
    }

    listenToProjectEvents("correctAnswer", correctAnswerHandler);
    listenToProjectEvents("print", printHandler);
    listenToProjectEvents("sceneCreated", sceneCreatedHandler);
    listenToProjectEvents("help", helpHandler);
    listenToProjectEvents("rotationAnglesSet", rotationAnglesSetHandler);
    listenToProjectEvents("configurationSet", configurationSetHandler);
    return () => {
      removeProjectEventListener("correctAnswer", correctAnswerHandler);
      removeProjectEventListener("print", printHandler);
      removeProjectEventListener("sceneCreated", sceneCreatedHandler);
      removeProjectEventListener("help", helpHandler);
      removeProjectEventListener("rotationAnglesSet", rotationAnglesSetHandler);
      removeProjectEventListener("configurationSet", configurationSetHandler);
    };
  }, []);

  useEffect(() => {
    const actualAnswerHandler = (e: ActualAnswer) => {
      if (lastTestData.current.correctAnswer === undefined) return;
      const { answer, time } = e.detail;
      const isCorrect = correct === answer;
      if (isCorrect) {
        toast({
          status: "success",
          position: "top-right",
          title: "Correct!",
        });
      } else {
        toast({
          status: "error",
          position: "top-right",
          title: "Wrong answer",
        });
      }
      lastTestData.current.actualAnswer = answer;
      lastTestData.current.time = time;
      lastTestData.current.correct = isCorrect;
      updateTestResults();
    };

    listenToProjectEvents("actualAnswer", actualAnswerHandler);
    return () => {
      removeProjectEventListener("actualAnswer", actualAnswerHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [correct, updateTestResults]);

  if (showHelp)
    return (
      <Box pos={"absolute"} top={5} left={5}>
        Correct: <Kbd>{correct}</Kbd>
      </Box>
    );

  return null;
};
