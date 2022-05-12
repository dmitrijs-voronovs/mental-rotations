import { KeyDownEventManagerI } from "@components/Games/EventManager/KeyDownEventManagerI";
import { KeyDownEventHandlerI } from "@components/Games/EventManager/KeyDownEventHandlerI";
import { SceneEventArgs } from "react-babylonjs";
import { EventState, KeyboardEventTypes, KeyboardInfo } from "@babylonjs/core";

export class KeyDownEventManager implements KeyDownEventManagerI {
  protected handlers: KeyDownEventHandlerI[] = [];

  constructor(protected sceneEventArgs: SceneEventArgs) {}

  handleEvent(e: KeyboardInfo, eventState: EventState): void {
    const key = e.event.key;
    if (e.type === KeyboardEventTypes.KEYDOWN) {
      for (const handler of this.handlers) {
        if (handler.test(key)) {
          handler.handle(key);
          return;
        }
      }
    }
  }

  registerHandler(handler: KeyDownEventHandlerI): this {
    handler.setContext(this.sceneEventArgs);
    this.handlers.push(handler);
    return this;
  }
}
