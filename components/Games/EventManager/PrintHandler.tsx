import { KeyDownEventHandler } from "@components/Games/EventManager/KeyDownEventHandler";
import { KeyDownEventHandlerI } from "@components/Games/EventManager/KeyDownEventHandlerI";
import { createScreenshots } from "../../../utils/CreateScreenshots";
import { dispatchProjectEvent } from "../../../utils/Events";

export class PrintHandler
  extends KeyDownEventHandler
  implements KeyDownEventHandlerI
{
  handle(key: string): void {
    dispatchProjectEvent("print");
  }

  test(key: string): boolean {
    return key === "p";
  }
}
