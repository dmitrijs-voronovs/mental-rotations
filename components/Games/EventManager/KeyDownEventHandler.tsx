import { KeyDownEventHandlerI } from "@components/Games/EventManager/KeyDownEventHandlerI";
import { SceneEventArgs } from "react-babylonjs";

export abstract class KeyDownEventHandler implements KeyDownEventHandlerI {
  protected sceneEventArgs!: SceneEventArgs;

  abstract handle(key: string): void;

  abstract test(key: string): boolean;

  setContext(sceneEventArgs: SceneEventArgs): void {
    this.sceneEventArgs = sceneEventArgs;
  }
}
