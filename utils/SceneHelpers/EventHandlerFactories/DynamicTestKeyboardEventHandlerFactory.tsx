import {IKeyboardEventHandlerFactory} from "./IKeyboardEventHandlerFactory";
import {SceneEventArgs} from "react-babylonjs";
import {Timer} from "@utils/LaunchTimer";
import {IKeyDownEventManager} from "../EventManager/IKeyDownEventManager";
import {KeyDownEventManager} from "../EventManager/KeyDownEventManager";
import {NumberHandler} from "../EventHandlers/NumberHandler";
import {HelpHandler} from "../EventHandlers/HelpHandler";
import {PrintHandler} from "../EventHandlers/PrintHandler";
import {DefaultHandler} from "../EventHandlers/DefaultHandler";

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
