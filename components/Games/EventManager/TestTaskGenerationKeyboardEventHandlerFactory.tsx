import { IKeyboardEventHandlerFactory } from "@components/Games/EventManager/IKeyboardEventHandlerFactory";
import { SceneEventArgs } from "react-babylonjs";
import { Timer } from "../../../utils/LaunchTimer";
import { Mesh } from "@babylonjs/core";
import { IKeyDownEventManager } from "@components/Games/EventManager/IKeyDownEventManager";
import { KeyDownEventManager } from "@components/Games/EventManager/KeyDownEventManager";
import { HelpHandler } from "@components/Games/EventManager/HelpHandler";
import { PrintHandler } from "@components/Games/EventManager/PrintHandler";
import { SkipHandler } from "@components/Games/EventManager/SkipHandler";
import { DefaultHandler } from "@components/Games/EventManager/DefaultHandler";
import { NumberHandlerWithScreenshots } from "@components/Games/EventManager/NumberHandlerWithScreenshots";

export class TestTaskGenerationKeyboardEventHandlerFactory
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
        new NumberHandlerWithScreenshots(
          this.sceneHelpers.timer,
          this.sceneHelpers.prepareScene,
          this.sceneHelpers.boxes
        )
      )
      .registerHandler(new HelpHandler())
      .registerHandler(new PrintHandler())
      .registerHandler(
        new SkipHandler(
          this.sceneHelpers.timer,
          this.sceneHelpers.prepareScene,
          this.sceneHelpers.boxes
        )
      )
      .registerHandler(new DefaultHandler());
  }
}
