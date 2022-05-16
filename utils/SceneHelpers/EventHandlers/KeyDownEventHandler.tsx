import {IKeyDownEventHandler} from "./IKeyDownEventHandler";
import {SceneEventArgs} from "react-babylonjs";

export abstract class KeyDownEventHandler implements IKeyDownEventHandler {
  protected sceneEventArgs!: SceneEventArgs;

  abstract handle(key: string): void;

  abstract test(key: string): boolean;

  setContext(sceneEventArgs: SceneEventArgs): void {
    this.sceneEventArgs = sceneEventArgs;
  }
}
