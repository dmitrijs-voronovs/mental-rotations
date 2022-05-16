import {IKeyboardEventHandlerFactory} from "./IKeyboardEventHandlerFactory";
import {SceneEventArgs} from "react-babylonjs";
import {Timer} from "@utils/LaunchTimer";
import {IKeyDownEventManager} from "../EventManager/IKeyDownEventManager";
import {KeyDownEventManager} from "../EventManager/KeyDownEventManager";
import {HelpHandler} from "../EventHandlers/HelpHandler";
import {PrintHandler} from "../EventHandlers/PrintHandler";
import {SkipHandler} from "../EventHandlers/SkipHandler";
import {DefaultHandler} from "../EventHandlers/DefaultHandler";
import {NumberHandlerWithScreenshots} from "../EventHandlers/NumberHandlerWithScreenshots";

export class TestTaskGenerationKeyboardEventHandlerFactory
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
        new NumberHandlerWithScreenshots(
          this.sceneHelpers.timer,
          this.sceneHelpers.prepareScene
        )
      )
      .registerHandler(new HelpHandler())
      .registerHandler(new PrintHandler())
      .registerHandler(
        new SkipHandler(this.sceneHelpers.timer, this.sceneHelpers.prepareScene)
      )
      .registerHandler(new DefaultHandler());
  }
}
