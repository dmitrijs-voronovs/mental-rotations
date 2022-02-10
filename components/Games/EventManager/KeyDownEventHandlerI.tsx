import { SceneEventArgs } from "react-babylonjs";

export interface KeyDownEventHandlerI {
  test(key: string): boolean;

  handle(key: string): void;

  setContext(sceneEventArgs: SceneEventArgs): void;
}
