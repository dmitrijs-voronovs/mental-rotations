import { IKeyDownEventHandler } from "../EventHandlers/IKeyDownEventHandler";
import { EventState, KeyboardInfo } from "@babylonjs/core";

export interface IKeyDownEventManager {
  registerHandler(handler: IKeyDownEventHandler): void;

  handleEvent(e: KeyboardInfo, eventState: EventState): void;
}
