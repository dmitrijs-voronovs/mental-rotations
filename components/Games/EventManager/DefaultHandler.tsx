import { KeyDownEventHandler } from "@components/Games/EventManager/KeyDownEventHandler";
import { KeyDownEventHandlerI } from "@components/Games/EventManager/KeyDownEventHandlerI";

export class DefaultHandler
  extends KeyDownEventHandler
  implements KeyDownEventHandlerI
{
  handle(key: string): void {
    console.log("key pressed:", key);
  }

  test(key: string): boolean {
    return true;
  }
}
