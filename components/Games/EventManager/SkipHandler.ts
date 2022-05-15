import { KeyDownEventHandler } from "@components/Games/EventManager/KeyDownEventHandler";
import { Timer } from "../../../utils/LaunchTimer";
import { Mesh } from "@babylonjs/core";
import { PrepareScene } from "@components/Games/ISceneInitializer";

export class SkipHandler extends KeyDownEventHandler {
  constructor(
    protected timer: Timer,
    protected prepareScene: PrepareScene,
    protected meshes: Mesh[]
  ) {
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
