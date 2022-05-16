import { SceneEventArgs } from "react-babylonjs";
import type { GUI } from "dat.gui";

export interface ISceneInitializer {
  sceneEventArgs: SceneEventArgs;
  gui?: GUI;

  init(): void;
}

export interface SceneInitializerCreator {
  new (sceneEventArgs: SceneEventArgs, gui?: GUI): ISceneInitializer;
}

// TODO: move out
export type PrepareSceneOptions = {
  skipMetadataIncrement: boolean;
};
export type PrepareScene = (options?: PrepareSceneOptions) => void;
