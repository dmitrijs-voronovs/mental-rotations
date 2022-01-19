import "@babylonjs/inspector";
import {
  ArcRotateCamera,
  Color3,
  Color4,
  KeyboardEventTypes,
  Mesh,
  MeshBuilder,
  Scalar,
  StandardMaterial,
  TransformNode,
  Vector3,
  Viewport,
} from "@babylonjs/core";
import React from "react";
import { Engine, Scene, SceneEventArgs } from "react-babylonjs";
import {
  defaultConfig,
  generateFigure,
  generateRotation,
  GenerationConfig,
  getTransformNodeName,
  recenterMesh,
  resetBoundingInfo,
  SHAPE_SIZE,
  updateBoundingInfo,
} from "../../utils/GenerateFigure";
import s from "../../styles/Proto.App.module.scss";
import classNames from "classnames";

type CameraConfig = Partial<ArcRotateCamera> & Partial<Viewport>;

const defaultCameraConfig: CameraConfig = {
  name: "camera-r",
  alpha: Math.PI * 0.25,
  beta: Math.PI * 0.3,
  radius: 25,
  target: new Vector3(0, 0, 0),
  height: 0.33,
  width: 0.2,
};

const camerasConfig: CameraConfig[] = [
  { x: 0.2, y: 0.66, height: 0.33, width: 0.2 },
  { x: 0.6, y: 0.66, height: 0.33, width: 0.2 },
  { x: 0.4, y: 0.33, height: 0.33, width: 0.2 },
  { x: 0, y: 0, height: 0.33, width: 0.2 },
  {
    x: 0.4,
    y: 0,
    height: 0.33,
    width: 0.2,
  },
  {
    x: 0.6,
    y: 0,
    height: 0.33,
    width: 0.2,
  },
  {
    x: 0.8,
    y: 0,
    height: 0.33,
    width: 0.2,
  },
  {
    x: 0.2,
    y: 0,
    height: 0.33,
    width: 0.2,
  },
];

declare global {
  type TestDataEntity = {
    taskN: 0;
    timeMs: number;
    referenceShapeConfig: GenerationConfig;
    resultingShapeConfig: GenerationConfig;
    rotation: { x: number; y: number; z: number };
    correctAnswer: number;
  };

  interface Window {
    testData: TestDataEntity[];
  }
}

export const POSITION_MULTIPLIER = 300;

function createScene(sceneEventArgs: SceneEventArgs) {
  const { scene, canvas } = sceneEventArgs;

  const cameras = camerasConfig.map((configRaw, i) => {
    const config = { ...configRaw, ...defaultCameraConfig };
    const camera = new ArcRotateCamera(
      `camera-${i}`,
      config.alpha!,
      config.beta!,
      config.radius!,
      new Vector3(
        config.x! * POSITION_MULTIPLIER,
        config.y! * POSITION_MULTIPLIER,
        0
      )!,
      scene,
      true
    );
    camera.viewport = new Viewport(
      config.x!,
      config.y!,
      config.width!,
      config.height!
    );
    // TODO: remove later
    camera.attachControl(canvas, true);
    scene.activeCameras = (scene.activeCameras || []).concat(camera);

    return camera;
  });

  function getBoxName(i: number) {
    return `box-${i}`;
  }

  function createShapes() {
    const shapes = camerasConfig.map((configRaw, i) => {
      const config = { ...configRaw, ...defaultCameraConfig };
      const box = MeshBuilder.CreateBox(
        getBoxName(i),
        {
          size: SHAPE_SIZE,
        },
        scene
      );
      box.scaling = new Vector3(1, 1, 1);
      box.position = new Vector3(
        config.x! * POSITION_MULTIPLIER,
        config.y! * POSITION_MULTIPLIER,
        0
      );
      box.isVisible = false;
      box.showBoundingBox = true;
      box.showSubMeshesBoundingBox = true;
      box.enableEdgesRendering();
      box.edgesWidth = 5;
      box.edgesColor = Color4.FromColor3(Color3.Black(), 1);

      const material =
        (scene.getMaterialByName(`box-material`) as StandardMaterial) ||
        new StandardMaterial(`box-material`, scene);
      material.diffuseColor = new Color3(0.82, 0.82, 0.82);
      material.specularColor = Color3.White();
      box.material = material;

      return box;
    });
    return shapes;
  }

  let shapes = createShapes();

  function getRandomAngle() {
    const rotationTimes = Math.floor(Scalar.RandomRange(0, 2));
    return rotationTimes * 90;
  }

  const getBaseFigureConfig = (source: Mesh): GenerationConfig => ({
    ...defaultConfig,
    originX: source.position.x,
    originY: source.position.y,
  });

  const rotateReferenceShape = (
    source: Mesh,
    target: Mesh,
    config: GenerationConfig
  ) => {
    resetBoundingInfo(target);

    const { position, name } = target;
    target.dispose();
    const parent = new TransformNode(getTransformNodeName(name));
    target = source.clone(target.name, parent);

    const rotation = generateRotation({
      finalRotationX: getRandomAngle(),
      finalRotationY: getRandomAngle(),
      finalRotationZ: getRandomAngle(),
    });
    target.rotation = rotation;

    const { x, y, z } = position;
    updateBoundingInfo(target);

    target.showSubMeshesBoundingBox = true;
    recenterMesh(parent, target, { originX: x, originY: y, originZ: z });
  };

  const cleanUp = () => {
    shapes.forEach((shape) => {
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
  };

  const generateAll = () => {
    const configReferenceShape = getBaseFigureConfig(shapes[0]);
    generateFigure(sceneEventArgs, configReferenceShape, shapes[0].name);
    rotateReferenceShape(shapes[0], shapes[1], configReferenceShape);

    const configTestShape = getBaseFigureConfig(shapes[2]);
    generateFigure(sceneEventArgs, configTestShape, shapes[2].name);
    rotateReferenceShape(shapes[2], shapes[3], configTestShape);
    rotateReferenceShape(shapes[2], shapes[4], configTestShape);
    rotateReferenceShape(shapes[2], shapes[5], configTestShape);
    rotateReferenceShape(shapes[2], shapes[6], configTestShape);
    rotateReferenceShape(shapes[2], shapes[7], configTestShape);
  };

  const launchTimer = () => {
    let startTime: number, stopTime: number;
    startTime = Date.now();
    return {
      stopTimer: () => {
        stopTime = Date.now();
        return stopTime - startTime;
      },
    };
  };

  generateAll();
  let timer = launchTimer();

  scene.onKeyboardObservable.add((eventInfo, state) => {
    if (eventInfo.type === KeyboardEventTypes.KEYDOWN) {
      const key = Number(eventInfo.event.key);
      switch (true) {
        case key >= 1 && key <= 5:
          const time = timer.stopTimer();
          const a = Scalar.RandomRange(0, 3);
          console.log({ key, time }, a, Math.floor(a));
          cleanUp();
          shapes = createShapes();
          generateAll();
          timer = launchTimer();
          return;
        default:
          return;
      }
    }
  });
}

const Game4 = () => {
  const onSceneMount = (sceneEventArgs: SceneEventArgs) => {
    const { scene } = sceneEventArgs;
    // const gui = generateGUI(sceneEventArgs);
    // scene.onDisposeObservable.add(() => gui.destroy());
    // createAxis(sceneEventArgs, AXIS_SIZE);
    createScene(sceneEventArgs);
    scene.debugLayer.show();
  };

  return (
    <>
      <div className={s.blockGrid}>
        <div className={classNames(s.block1, s.block)}>is rotated to</div>
        <div className={classNames(s.block2, s.block)}>as</div>
        <div className={classNames(s.block3, s.block)}>is rotated to</div>
        <div className={classNames(s.blockWithVariants, s.block)}>
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
          <div>5</div>
        </div>
      </div>
      {/*<EventDisplay />*/}
      <Engine
        antialias
        adaptToDeviceRatio
        canvasId="babylonJS"
        canvasStyle={{
          flex: "1",
          display: "flex",
          width: "100%",
          height: "100vh",
          paddingBottom: "4rem",
        }}
        debug
      >
        <Scene
          key="scene3"
          onSceneMount={onSceneMount}
          clearColor={Color4.FromColor3(Color3.White())}
        >
          <hemisphericLight
            name="light1"
            intensity={1}
            direction={Vector3.Up()}
            // direction={new Vector3(0, 0, 0)}
            groundColor={Color3.White()}
            specular={Color3.Black()}
          />
        </Scene>
      </Engine>
    </>
  );
};

export default Game4;
