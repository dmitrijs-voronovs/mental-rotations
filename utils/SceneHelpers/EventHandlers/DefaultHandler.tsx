import {KeyDownEventHandler} from "./KeyDownEventHandler";
import {IKeyDownEventHandler} from "./IKeyDownEventHandler";

export class DefaultHandler
  extends KeyDownEventHandler
  implements IKeyDownEventHandler
{
  handle(key: string): void {
    console.log("key pressed:", key);
  }

  test(key: string): boolean {
    return true;
  }
}
