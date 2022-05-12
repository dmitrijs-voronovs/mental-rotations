import { IKeyboardEventHandlerFactory } from "@components/Games/EventManager/IKeyboardEventHandlerFactory";
import { SceneEventArgs } from "react-babylonjs";
import { Timer } from "../../../utils/LaunchTimer";
import { Mesh } from "@babylonjs/core";
import { IKeyDownEventManager } from "@components/Games/EventManager/IKeyDownEventManager";
import { KeyDownEventManager } from "@components/Games/EventManager/KeyDownEventManager";
import { NumberHandler } from "@components/Games/EventManager/NumberHandler";
import { HelpHandler } from "@components/Games/EventManager/HelpHandler";
import { PrintHandler } from "@components/Games/EventManager/PrintHandler";
import { DefaultHandler } from "@components/Games/EventManager/DefaultHandler";

export class DynamicTestKeyboardEventHandlerFactory
  implements IKeyboardEventHandlerFactory
{
  constructor(
    public sceneEventArgs: SceneEventArgs,
    public sceneHelpers: {
      timer: Timer;
      prepareScene: () => void;
      boxes: Mesh[];
    }
  ) {}

  create(): IKeyDownEventManager {
    return new KeyDownEventManager(this.sceneEventArgs)
      .registerHandler(
        new NumberHandler(
          this.sceneHelpers.timer,
          this.sceneHelpers.prepareScene,
          this.sceneHelpers.boxes
        )
      )
      .registerHandler(new HelpHandler())
      .registerHandler(new PrintHandler())
      .registerHandler(new DefaultHandler());
  }
}
