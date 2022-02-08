import { KeyDownEventHandler } from "@components/Games/EventManager/KeyDownEventHandler";
import { launchTimer } from "../../../utils/LaunchTimer";
import { Mesh } from "@babylonjs/core";
import { dispatchProjectEvent } from "../../../utils/Events";
import { cleanUp } from "../../../utils/GenerateScene";

export class NumberHandler extends KeyDownEventHandler {
  constructor(
    protected stopTimer: ReturnType<typeof launchTimer>,
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
      dispatchProjectEvent("actualAnswer", numKey);

      const time = this.stopTimer();

      cleanUp(this.sceneEventArgs, this.meshes);
      this.prepareScene();
    }
  }
}
