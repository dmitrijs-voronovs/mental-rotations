import { GenerationConfig } from "@utils/SceneHelpers/SceneGenerators/GenerateFigure";
import { TestScreenshots } from "@components/EventDisplay";

export interface Print extends Event {}

export interface Skip extends Event {}

export interface CorrectAnswer extends CustomEvent<number> {}

export interface ActualAnswer
  extends CustomEvent<{ answer: number; time: number }> {}

export interface Help extends Event {}

export interface ConfigurationSet
  extends CustomEvent<{
    isForReferenceShape: boolean;
    config: GenerationConfig;
  }> {}
export interface RotationAnglesSet
  extends CustomEvent<{ x: number; y: number; z: number }> {}
export interface SceneCreated extends CustomEvent<TestScreenshots> {}

export type ProjectEventMap = {
  skip: Skip;
  print: Print;
  help: Help;
  actualAnswer: ActualAnswer;
  correctAnswer: CorrectAnswer;
  configurationSet: ConfigurationSet;
  rotationAnglesSet: RotationAnglesSet;
  sceneCreated: SceneCreated;
};

declare global {
  export interface DocumentEventMap extends ProjectEventMap {}
}
