import { SceneEventArgs } from "react-babylonjs";
import { GUI } from "dat.gui";

export interface ISceneInitializer {
  sceneEventArgs: SceneEventArgs;
  gui?: GUI;

  init(): void;
}

export interface SceneInitializerCreator {
  new (sceneEventArgs: SceneEventArgs, gui?: GUI): ISceneInitializer;
}

export abstract class BaseSceneInitializer implements ISceneInitializer {
  constructor(public sceneEventArgs: SceneEventArgs, public gui?: GUI) {}

  abstract init(): void;
}

// TODO: move out
export type PrepareSceneOptions = {
  skipMetadataIncrement: boolean;
};
export type PrepareScene = (options?: PrepareSceneOptions) => void;
