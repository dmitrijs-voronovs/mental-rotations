import {
  ISceneInitializer,
  PrepareScene,
  PrepareSceneOptions,
} from "@components/Games/ISceneInitializer";
import { cleanUp, createBoxes, createCameras } from "../../utils/GenerateScene";
import { positionConfig } from "../../utils/positionConfig";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Mesh, PointerEventTypes } from "@babylonjs/core";
import { launchTimer } from "../../utils/LaunchTimer";
import { getBoxName } from "../../utils/names";
import { adjustCameraRadiusToFitMesh } from "../../utils/GenerateFigure";
import { TestTaskGenerationKeyboardEventHandlerFactory } from "@components/Games/EventManager/TestTaskGenerationKeyboardEventHandlerFactory";
import { saveScreenshots } from "../../utils/SaveScreenshots";
import { dispatchProjectEvent } from "../../utils/Events";
import { getShapeConfig } from "@components/Games/Test";
import { BaseSceneInitializer } from "@components/Games/BaseSceneInitializer";

export class TestGenerationSceneInitializer
  extends BaseSceneInitializer
  implements ISceneInitializer
{
  init(): void {
    const { scene, canvas } = this.sceneEventArgs;
    const cameras = createCameras(
      this.sceneEventArgs,
      positionConfig,
      (camera: ArcRotateCamera) => {
        // only for isometric view of cameras
        // camera.fov = 0.1;
      }
    );
    let boxes: Mesh[] = [];
    const timer = launchTimer();

    const prepareScene: PrepareScene = (options?: PrepareSceneOptions) => {
      cleanUp(this.sceneEventArgs, boxes);

      const { skipMetadataIncrement = false } = options || {};
      if (scene.metadata === null || !skipMetadataIncrement) {
        scene.metadata = scene.metadata === null ? 0 : scene.metadata + 1;
      }
      boxes = createBoxes(this.sceneEventArgs, positionConfig, (box) => {
        // if isometric
        // box.edgesWidth = 50;
      });
      const shapeConfig = getShapeConfig(this.gui);
      this.generateFigures(boxes, this.sceneEventArgs, shapeConfig, (inst) => {
        // inst.scalingDeterminant = 0.99;
        // inst.scalingDeterminant = 1.5;
      });
      cameras.forEach((camera, i) => {
        // get meshes from world / instead of directly to make sure new props are included
        const relatedMesh = scene.getMeshByName(getBoxName(i))! as Mesh;
        adjustCameraRadiusToFitMesh(relatedMesh, camera);
      });
      timer.restartTimer();
    };

    prepareScene();

    const KeyboardEventHandler =
      new TestTaskGenerationKeyboardEventHandlerFactory(this.sceneEventArgs, {
        timer,
        prepareScene,
        boxes: boxes!,
      }).create();

    scene.onKeyboardObservable.add((eventInfo, eventState) =>
      KeyboardEventHandler.handleEvent(eventInfo, eventState)
    );

    scene.onPointerObservable.add((pointerInfo) => {
      switch (pointerInfo.type) {
        case PointerEventTypes.POINTERDOWN:
          console.log(pointerInfo);
          const targetMeshMinY = (canvas.clientHeight / 9) * 5;
          if (pointerInfo.event.clientY < targetMeshMinY) return;
          const segmentWidth = canvas.clientWidth / 5;
          const pickedMesh = Math.ceil(
            pointerInfo.event.clientX / segmentWidth
          );

          console.log(pickedMesh);
          const time = timer.stopTimer();
          if (this.sceneEventArgs.scene.metadata !== 0) {
            saveScreenshots(this.sceneEventArgs);
          }
          dispatchProjectEvent("actualAnswer", { answer: pickedMesh, time });

          prepareScene();
          break;
      }
    });
  }

  shouldGenerateFigures(): boolean {
    return Boolean(this.sceneEventArgs.scene.metadata);
  }
}
