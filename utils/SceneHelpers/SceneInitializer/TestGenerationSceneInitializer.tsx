import {ISceneInitializer, PrepareSceneOptions} from "./ISceneInitializer";
import {InstancedMesh, PointerEventTypes} from "@babylonjs/core";
import {GenerationConfig} from "@utils/../SceneGenerators/GenerateFigure";
import {
  TestTaskGenerationKeyboardEventHandlerFactory
} from "@utils/SceneHelpers/EventHandlerFactories/TestTaskGenerationKeyboardEventHandlerFactory";
import {saveScreenshots} from "@utils/Screenshots/SaveScreenshots";
import {BaseSceneInitializer} from "./BaseSceneInitializer";
import {dispatchProjectEvent} from "../../../events/Actions";

export class TestGenerationSceneInitializer
  extends BaseSceneInitializer
  implements ISceneInitializer
{
  protected KeyboardEventHandlerFactory =
    TestTaskGenerationKeyboardEventHandlerFactory;

  protected initMouseHandler() {
    this.sceneEventArgs.scene.onPointerObservable.add((pointerInfo) => {
      switch (pointerInfo.type) {
        case PointerEventTypes.POINTERDOWN:
          console.log(pointerInfo);
          const targetMeshMinY =
            (this.sceneEventArgs.canvas.clientHeight / 9) * 5;
          if (pointerInfo.event.clientY < targetMeshMinY) return;
          const segmentWidth = this.sceneEventArgs.canvas.clientWidth / 5;
          const pickedMesh = Math.ceil(
            pointerInfo.event.clientX / segmentWidth
          );

          console.log(pickedMesh);
          const time = this.timer!.stopTimer();
          if (this.sceneEventArgs.scene.metadata !== 0) {
            saveScreenshots(this.sceneEventArgs);
          }
          dispatchProjectEvent("actualAnswer", { answer: pickedMesh, time });

          this.prepareScene();
          break;
      }
    });
  }

  protected prepareScene(options?: PrepareSceneOptions) {
    const { skipMetadataIncrement = false } = options || {};
    if (this.sceneEventArgs.scene.metadata === null || !skipMetadataIncrement) {
      this.sceneEventArgs.scene.metadata =
        this.sceneEventArgs.scene.metadata === null
          ? 0
          : this.sceneEventArgs.scene.metadata + 1;
    }
    super.prepareScene(options);
  }

  protected generateFigures(
    shapeConfig: GenerationConfig,
    withInstance?: (inst: InstancedMesh) => void
  ) {
    if (!Boolean(this.sceneEventArgs.scene.metadata)) return;
    super.generateFigures(shapeConfig, withInstance);
  }
}
