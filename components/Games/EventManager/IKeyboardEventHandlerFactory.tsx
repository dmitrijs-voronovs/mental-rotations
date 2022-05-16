import { SceneEventArgs } from "react-babylonjs";
import { Timer } from "../../../utils/LaunchTimer";
import { IKeyDownEventManager } from "@components/Games/EventManager/IKeyDownEventManager";

export interface IKeyboardEventHandlerFactory {
  create(): IKeyDownEventManager;
}

export interface KeyboardEventHandlerFactoryCreator {
  new (
    sceneEventArgs: SceneEventArgs,
    sceneHelpers: {
      timer: Timer;
      prepareScene: () => void;
    }
  ): IKeyboardEventHandlerFactory;
}
