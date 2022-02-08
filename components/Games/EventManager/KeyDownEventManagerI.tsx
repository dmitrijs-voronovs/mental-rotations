import { KeyDownEventHandlerI } from "@components/Games/EventManager/KeyDownEventHandlerI";
import { EventState, KeyboardInfo } from "@babylonjs/core";

export interface KeyDownEventManagerI {
  registerHandler(handler: KeyDownEventHandlerI): void;

  // deleteHandler(handlerId: number): void;
  handleEvent(e: KeyboardInfo, eventState: EventState): void;
}
