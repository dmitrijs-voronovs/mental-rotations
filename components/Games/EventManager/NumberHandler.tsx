import { KeyDownEventHandler } from "@components/Games/EventManager/KeyDownEventHandler";
import { Timer } from "../../../utils/LaunchTimer";
import { Mesh } from "@babylonjs/core";
import { dispatchProjectEvent } from "../../../utils/Events";
import { PrepareScene } from "@components/Games/ISceneInitializer";
import { KeyDownEventHandlerI } from "@components/Games/EventManager/KeyDownEventHandlerI";

export class NumberHandler
  extends KeyDownEventHandler
  implements KeyDownEventHandlerI
{
  constructor(
    protected timer: Timer,
    protected prepareScene: PrepareScene,
    protected meshes: Mesh[]
  ) {
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
