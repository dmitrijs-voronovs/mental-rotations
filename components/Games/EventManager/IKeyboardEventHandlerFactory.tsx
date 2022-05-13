import { SceneEventArgs } from "react-babylonjs";
import { Timer } from "../../../utils/LaunchTimer";
import { Mesh } from "@babylonjs/core";
import { IKeyDownEventManager } from "@components/Games/EventManager/IKeyDownEventManager";

export interface IKeyboardEventHandlerFactory {
  sceneEventArgs: SceneEventArgs;
  sceneHelpers: {
    timer: Timer;
    prepareScene: () => void;
    boxes: Mesh[];
  };

  create(): IKeyDownEventManager;
}
