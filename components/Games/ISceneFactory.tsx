import { SceneEventArgs } from "react-babylonjs";
import { GUI } from "dat.gui";

export interface ISceneFactory {
  sceneEventArgs: SceneEventArgs;
  gui?: GUI;

  create(): void;
}

export abstract class BaseSceneFactory implements ISceneFactory {
  constructor(public sceneEventArgs: SceneEventArgs, public gui?: GUI) {}

  abstract create(): void;
}

export type PrepareSceneOptions = {
  skipMetadataIncrement: boolean;
};
export type PrepareScene = (options?: PrepareSceneOptions) => void;
