import { IKeyboardEventHandlerFactory } from "@components/Games/EventManager/IKeyboardEventHandlerFactory";
import { SceneEventArgs } from "react-babylonjs";
import { Timer } from "../../../utils/LaunchTimer";
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
    protected sceneEventArgs: SceneEventArgs,
    protected sceneHelpers: {
      timer: Timer;
      prepareScene: () => void;
    }
  ) {}

  create(): IKeyDownEventManager {
    return new KeyDownEventManager(this.sceneEventArgs)
      .registerHandler(
        new NumberHandler(
          this.sceneHelpers.timer,
          this.sceneHelpers.prepareScene
        )
      )
      .registerHandler(new HelpHandler())
      .registerHandler(new PrintHandler())
      .registerHandler(new DefaultHandler());
  }
}
