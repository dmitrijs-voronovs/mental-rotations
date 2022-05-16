import {KeyDownEventHandler} from "./KeyDownEventHandler";
import {IKeyDownEventHandler} from "./IKeyDownEventHandler";
import {dispatchProjectEvent} from "../../../events/Actions";

export class HelpHandler
  extends KeyDownEventHandler
  implements IKeyDownEventHandler
{
  handle(key: string): void {
    dispatchProjectEvent("help");
  }

  test(key: string): boolean {
    return key === "h";
  }
}
