import { KeyDownEventHandler } from "@components/Games/EventManager/KeyDownEventHandler";
import { KeyDownEventHandlerI } from "@components/Games/EventManager/KeyDownEventHandlerI";
import { dispatchProjectEvent } from "../../../utils/Events";

export class HelpHandler
  extends KeyDownEventHandler
  implements KeyDownEventHandlerI
{
  handle(key: string): void {
    dispatchProjectEvent("help");
  }

  test(key: string): boolean {
    return key === "h";
  }
}
