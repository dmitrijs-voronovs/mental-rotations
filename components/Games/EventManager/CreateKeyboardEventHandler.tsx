import { SceneEventArgs } from "react-babylonjs";
import { Mesh } from "@babylonjs/core";
import { KeyDownEventManager } from "@components/Games/EventManager/KeyDownEventManager";
import { NumberHandler } from "@components/Games/EventManager/NumberHandler";
import { HelpHandler } from "@components/Games/EventManager/HelpHandler";
import { PrintHandler } from "@components/Games/EventManager/PrintHandler";
import { DefaultHandler } from "@components/Games/EventManager/DefaultHandler";
import { Timer } from "../../../utils/LaunchTimer";

export function createKeyboardEventHandler(
  sceneEventArgs: SceneEventArgs,
  sceneHelpers: {
    timer: Timer;
    prepareScene: () => void;
    boxes: Mesh[];
  }
) {
  const KeyboardEventHandler = new KeyDownEventManager(sceneEventArgs);
  KeyboardEventHandler.registerHandler(
    new NumberHandler(
      sceneHelpers.timer,
      sceneHelpers.prepareScene,
      sceneHelpers.boxes
    )
  );
  KeyboardEventHandler.registerHandler(new HelpHandler());
  KeyboardEventHandler.registerHandler(new PrintHandler());
  KeyboardEventHandler.registerHandler(new DefaultHandler());
  return KeyboardEventHandler;
}
