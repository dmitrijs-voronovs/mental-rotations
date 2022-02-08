import { SceneEventArgs } from "react-babylonjs";
import { Mesh } from "@babylonjs/core";
import { KeyDownEventManager } from "@components/Games/EventManager/KeyDownEventManager";
import { NumberHandler } from "@components/Games/EventManager/NumberHandler";
import { HelpHandler } from "@components/Games/EventManager/HelpHandler";
import { PrintHandler } from "@components/Games/EventManager/PrintHandler";
import { DefaultHandler } from "@components/Games/EventManager/DefaultHandler";

export function createKeyboardEventHandler(
  sceneEventArgs: SceneEventArgs,
  sceneHelpers: {
    stopTimer: () => number;
    prepareScene: () => void;
    boxes: Mesh[];
  }
) {
  const KeyboardEventHandler = new KeyDownEventManager(sceneEventArgs);
  KeyboardEventHandler.registerHandler(
    new NumberHandler(
      sceneHelpers.stopTimer,
      sceneHelpers.prepareScene,
      sceneHelpers.boxes
    )
  );
  KeyboardEventHandler.registerHandler(new HelpHandler());
  KeyboardEventHandler.registerHandler(new PrintHandler());
  KeyboardEventHandler.registerHandler(new DefaultHandler());
  return KeyboardEventHandler;
}
