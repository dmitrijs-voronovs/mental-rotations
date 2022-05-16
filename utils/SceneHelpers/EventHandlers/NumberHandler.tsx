import {KeyDownEventHandler} from "./KeyDownEventHandler";
import {Timer} from "@utils/LaunchTimer";
import {PrepareScene} from "../SceneInitializer/ISceneInitializer";
import {IKeyDownEventHandler} from "./IKeyDownEventHandler";
import {dispatchProjectEvent} from "../../../events/Actions";

export class NumberHandler
  extends KeyDownEventHandler
  implements IKeyDownEventHandler
{
  constructor(protected timer: Timer, protected prepareScene: PrepareScene) {
    super();
  }

  test(key: string): boolean {
    const number = Number(key);
    return !Number.isNaN(number) && number >= 1 && number <= 5;
  }

  handle(key: string): void {
    const numKey = Number(key);
    if (numKey >= 1 && numKey <= 5) {
      const time = this.timer.stopTimer();
      dispatchProjectEvent("actualAnswer", { answer: numKey, time });
      this.prepareScene();
    }
  }
}
