import {IKeyDownEventManager} from "./IKeyDownEventManager";
import {IKeyDownEventHandler} from "../EventHandlers/IKeyDownEventHandler";
import {SceneEventArgs} from "react-babylonjs";
import {EventState, KeyboardEventTypes, KeyboardInfo} from "@babylonjs/core";

export class KeyDownEventManager implements IKeyDownEventManager {
  protected handlers: IKeyDownEventHandler[] = [];

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

  registerHandler(handler: IKeyDownEventHandler): this {
    handler.setContext(this.sceneEventArgs);
    this.handlers.push(handler);
    return this;
  }
}
