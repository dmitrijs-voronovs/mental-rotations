import { GenerationConfig } from "./GenerateFigure";
import { TestScreenshots } from "@components/EventDisplay";

export interface Print extends Event {}
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

type ProjectEventMap = {
  print: Print;
  help: Help;
  actualAnswer: ActualAnswer;
  correctAnswer: CorrectAnswer;
  configurationSet: ConfigurationSet;
  rotationAnglesSet: RotationAnglesSet;
  sceneCreated: SceneCreated;
};

type SimpleEventKeys = {
  [Key in keyof ProjectEventMap]: ProjectEventMap[Key] extends CustomEvent
    ? never
    : Key;
}[keyof ProjectEventMap];
type CustomEventKeys = Exclude<keyof ProjectEventMap, SimpleEventKeys>;

declare global {
  export interface DocumentEventMap extends ProjectEventMap {}
}

export function dispatchProjectEvent<T extends SimpleEventKeys>(name: T): void;
export function dispatchProjectEvent<T extends CustomEventKeys>(
  name: T,
  data: ProjectEventMap[T]["detail"]
): void;
export function dispatchProjectEvent<T extends keyof ProjectEventMap>(
  name: T,
  data?: ProjectEventMap[T] extends CustomEvent
    ? ProjectEventMap[T]["detail"]
    : never
): void {
  if (data) {
    document.dispatchEvent(new CustomEvent(name, { detail: data }));
  } else {
    document.dispatchEvent(new Event(name));
  }
}

export function listenToProjectEvents<T extends keyof ProjectEventMap>(
  name: T,
  callback: (event: ProjectEventMap[T]) => void,
  options?: Parameters<typeof document.addEventListener>[2]
): void {
  document.addEventListener(name, callback, options);
}

export function removeProjectEventListener<T extends keyof ProjectEventMap>(
  name: T,
  callback: (event: ProjectEventMap[T]) => void
): void {
  document.removeEventListener(name, callback);
}
