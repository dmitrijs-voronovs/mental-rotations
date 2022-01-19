import { GenerationConfig } from "../utils/GenerateFigure";

declare global {
  type TestDataEntity = {
    taskN: 0;
    timeMs: number;
    referenceShapeConfig: GenerationConfig;
    resultingShapeConfig: GenerationConfig;
    rotation: { x: number; y: number; z: number };
    correctAnswer: number;
  };

  interface Window {
    testData: TestDataEntity[];
  }
}
