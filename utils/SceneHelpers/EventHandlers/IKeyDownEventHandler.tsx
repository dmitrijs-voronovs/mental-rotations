import { SceneEventArgs } from "react-babylonjs";

export interface IKeyDownEventHandler {
  test(key: string): boolean;

  handle(key: string): void;

  setContext(sceneEventArgs: SceneEventArgs): void;
}
