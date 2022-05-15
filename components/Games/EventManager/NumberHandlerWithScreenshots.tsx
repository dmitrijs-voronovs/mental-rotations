import { saveScreenshots } from "../../../utils/SaveScreenshots";
import { dispatchProjectEvent } from "../../../utils/Events";
import { NumberHandler } from "@components/Games/EventManager/NumberHandler";

export class NumberHandlerWithScreenshots extends NumberHandler {
  handle(key: string): void {
    const numKey = Number(key);
    if (numKey >= 1 && numKey <= 5) {
      const time = this.timer.stopTimer();

      if (this.sceneEventArgs.scene.metadata !== 0) {
        saveScreenshots(this.sceneEventArgs);
      }
      dispatchProjectEvent("actualAnswer", { answer: numKey, time });
      this.prepareScene();
    }
  }
}
