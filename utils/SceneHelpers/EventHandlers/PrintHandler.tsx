import {KeyDownEventHandler} from "./KeyDownEventHandler";
import {IKeyDownEventHandler} from "./IKeyDownEventHandler";
import {dispatchProjectEvent} from "../../../events/Actions";

export class PrintHandler
  extends KeyDownEventHandler
  implements IKeyDownEventHandler
{
  handle(key: string): void {
    dispatchProjectEvent("print");
  }

  test(key: string): boolean {
    return key === "p";
  }
}
