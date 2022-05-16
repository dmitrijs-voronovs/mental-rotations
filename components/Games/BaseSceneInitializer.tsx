import { SceneEventArgs } from "react-babylonjs";
import { GUI } from "dat.gui";
import { InstancedMesh, Mesh, Scalar, Vector3 } from "@babylonjs/core";
import {
  adjustCameraRadiusToFitMesh,
  generateFigure,
  GenerationConfig,
} from "../../utils/GenerateFigure";
import {
  createBoxes,
  createCameras,
  getAngleOfVector,
  getBaseFigureConfig,
  rotateReferenceShape,
  rotateReferenceShapes,
} from "../../utils/GenerateScene";
import { dispatchProjectEvent } from "../../utils/Events";
import {
  ISceneInitializer,
  PrepareSceneOptions,
} from "@components/Games/ISceneInitializer";
import { getBoxName, getTransformNodeName } from "../../utils/names";
import { launchTimer, Timer } from "../../utils/LaunchTimer";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { positionConfig } from "../../utils/positionConfig";
import { getShapeConfig } from "@components/Games/Test";
import { KeyboardEventHandlerFactoryCreator } from "@components/Games/EventManager/IKeyboardEventHandlerFactory";

export abstract class BaseSceneInitializer implements ISceneInitializer {
  protected cameras: ArcRotateCamera[] = [];
  protected boxes: Mesh[] = [];
  protected timer?: Timer;
  protected abstract KeyboardEventHandlerFactory: KeyboardEventHandlerFactoryCreator;

  protected abstract initMouseHandler(): void;

  constructor(public sceneEventArgs: SceneEventArgs, public gui?: GUI) {}

  init(): void {
    this.cameras = createCameras(
      this.sceneEventArgs,
      positionConfig,
      (camera: ArcRotateCamera) => {
        // only for isometric view of cameras
        // camera.fov = 0.1;
      }
    );
    this.timer = launchTimer();
    this.prepareScene();
    this.initHandlers();
  }

  protected initHandlers() {
    this.initKeyboardHandler();
    this.initMouseHandler();
  }

  protected initKeyboardHandler() {
    const KeyboardEventHandler = new this.KeyboardEventHandlerFactory(
      this.sceneEventArgs,
      {
        timer: this.timer!,
        prepareScene: this.prepareScene.bind(this),
      }
    ).create();

    this.sceneEventArgs.scene.onKeyboardObservable.add(
      (eventInfo, eventState) =>
        KeyboardEventHandler.handleEvent(eventInfo, eventState)
    );
  }

  protected generateFigures(
    shapeConfig: GenerationConfig,
    withInstance?: (inst: InstancedMesh) => void
  ) {
    const configReferenceShape = getBaseFigureConfig(
      this.boxes[0],
      shapeConfig
    );
    dispatchProjectEvent("configurationSet", {
      isForReferenceShape: true,
      config: configReferenceShape,
    });

    generateFigure(
      this.sceneEventArgs,
      configReferenceShape,
      this.boxes[0].name,
      withInstance
    );
    const correctAngle = rotateReferenceShape(this.boxes[0], this.boxes[1], {
      ignoreAngles: [Vector3.Zero()],
    });

    dispatchProjectEvent("rotationAnglesSet", {
      x: getAngleOfVector("x", correctAngle),
      y: getAngleOfVector("y", correctAngle),
      z: getAngleOfVector("z", correctAngle),
    });

    const configTestShape = getBaseFigureConfig(this.boxes[2], shapeConfig);
    dispatchProjectEvent("configurationSet", {
      isForReferenceShape: false,
      config: configTestShape,
    });
    generateFigure(
      this.sceneEventArgs,
      configTestShape,
      this.boxes[2].name,
      withInstance
    );
    const meshesToRotate = [
      this.boxes[3],
      this.boxes[4],
      this.boxes[5],
      this.boxes[6],
      this.boxes[7],
    ];
    const correctShapeIdx = Math.floor(
      Scalar.RandomRange(0, meshesToRotate.length)
    );

    dispatchProjectEvent("correctAnswer", correctShapeIdx + 1);
    rotateReferenceShapes(
      this.boxes[2],
      meshesToRotate,
      correctAngle,
      correctShapeIdx
    );
  }

  protected prepareScene(options?: PrepareSceneOptions) {
    this.cleanUp();
    this.boxes = createBoxes(this.sceneEventArgs, positionConfig, (box) => {
      // if isometric
      // box.edgesWidth = 50;
    });
    const shapeConfig = getShapeConfig(this.gui);
    this.generateFigures(shapeConfig, (inst) => {
      // inst.scalingDeterminant = 0.99;
      // inst.scalingDeterminant = 1;
    });
    this.cameras.forEach((camera, i) => {
      // get meshes from world / instead of directly to make sure new props are included
      const relatedMesh = this.sceneEventArgs.scene.getMeshByName(
        getBoxName(i)
      )! as Mesh;
      adjustCameraRadiusToFitMesh(relatedMesh, camera);
    });
    this.timer!.restartTimer();
  }

  protected cleanUp() {
    const { scene } = this.sceneEventArgs;
    console.log({ meshes: this.boxes });
    this.boxes.forEach((shape) => {
      const shapeName = shape.name;
      const transformNode = scene.getTransformNodeByName(
        getTransformNodeName(shapeName)
      );
      if (transformNode) {
        const allMeshes = transformNode.getChildMeshes(false);
        allMeshes.forEach((mesh) => scene.removeMesh(mesh));
        scene.removeTransformNode(transformNode);
      }
    });
  }
}
