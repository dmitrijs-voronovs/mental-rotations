import { ISceneInitializer } from "@components/Games/ISceneInitializer";
import { PointerEventTypes } from "@babylonjs/core";
import { DynamicTestKeyboardEventHandlerFactory } from "@components/Games/EventManager/DynamicTestKeyboardEventHandlerFactory";
import { dispatchProjectEvent } from "../../utils/Events";
import { BaseSceneInitializer } from "@components/Games/BaseSceneInitializer";

export class DynamicSceneInitializer
  extends BaseSceneInitializer
  implements ISceneInitializer
{
  protected KeyboardEventHandlerFactory =
    DynamicTestKeyboardEventHandlerFactory;

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
          dispatchProjectEvent("actualAnswer", { answer: pickedMesh, time });

          this.prepareScene();
          break;
      }
    });
  }
}
