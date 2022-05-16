import {KeyDownEventHandler} from "./KeyDownEventHandler";
import {Timer} from "@utils/LaunchTimer";
import {PrepareScene} from "../SceneInitializer/ISceneInitializer";

export class SkipHandler extends KeyDownEventHandler {
  constructor(protected timer: Timer, protected prepareScene: PrepareScene) {
    super();
  }

  handle(key: string): void {
    this.timer.stopTimer();
    this.prepareScene({ skipMetadataIncrement: true });
  }

  test(key: string): boolean {
    return key === "s";
  }
}
