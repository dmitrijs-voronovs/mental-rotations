import { KeyDownEventHandler } from "@components/Games/EventManager/KeyDownEventHandler";
import { launchTimer, Timer } from "../../../utils/LaunchTimer";
import { Mesh } from "@babylonjs/core";
import { dispatchProjectEvent } from "../../../utils/Events";
import { cleanUp } from "../../../utils/GenerateScene";

export class NumberHandler extends KeyDownEventHandler {
  constructor(
    protected timer: Timer,
    protected prepareScene: () => void,
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

      cleanUp(this.sceneEventArgs, this.meshes);
      this.prepareScene();
    }
  }
}
