import "@babylonjs/inspector";
import {
  ArcRotateCamera,
  Camera,
  Color3,
  Color4,
  Mesh,
  MeshBuilder,
  Scalar,
  StandardMaterial,
  TransformNode,
  Vector2,
  Vector3,
  Viewport,
} from "@babylonjs/core";
import React from "react";
import { Box, Engine, Scene, SceneEventArgs, useScene } from "react-babylonjs";
import { createAxis } from "@components/Axis/axisHelper";
import { AXIS_SIZE, generateGUI } from "../../utils/GenerateGUI";
import {
  defaultConfig,
  generateFigure,
  generateRotation,
  GenerationConfig,
  SHAPE_NAME,
  SHAPE_SIZE,
} from "../../utils/GenerateFigure";
import s from "../../styles/Proto.App.module.scss";
import classNames from "classnames";

type CameraConfig = Partial<ArcRotateCamera> & Partial<Viewport>;

const defaultCameraConfig: CameraConfig = {
  name: "camera-r",
  alpha: Math.PI * 0.25,
  beta: Math.PI * 0.3,
  radius: 15,
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

  const shapes = camerasConfig.map((configRaw, i) => {
    const config = { ...configRaw, ...defaultCameraConfig };
    const box = MeshBuilder.CreateBox(getBoxName(i), {
      size: SHAPE_SIZE,
    });
    box.scaling = new Vector3(1, 1, 1);
    box.position = new Vector3(
      config.x! * POSITION_MULTIPLIER,
      config.y! * POSITION_MULTIPLIER,
      0
    );
    box.isVisible = false;
    box.enableEdgesRendering();
    box.edgesWidth = 5;
    box.edgesColor = Color4.FromColor3(Color3.Black(), 1);

    const material = new StandardMaterial(`box-material-${1}`, scene);
    material.diffuseColor = new Color3(0.82, 0.82, 0.82);
    material.specularColor = Color3.White();

    box.material = material;
    return box;
  });

  function getRandomAngle() {
    const rotationTimes = Math.floor(Scalar.RandomRange(0, 4));
    return rotationTimes * 90;
  }

  const rotateReferenceShape = () => {
    const baseFigureConfig: GenerationConfig = {
      ...defaultConfig,
      originX: shapes[0].position.x,
      originY: shapes[0].position.y,
    };

    generateFigure(sceneEventArgs, baseFigureConfig, shapes[0].name);

    const { position } = shapes[1];
    shapes[1].dispose();
    shapes[1] = shapes[0].clone(getBoxName(1));
    console.log({ position });

    const transformParent = new TransformNode(`transform-${getBoxName(1)}`);
    shapes[1].parent = transformParent;
    shapes[1].position = position;

    const rotation = generateRotation({
      finalRotationX: getRandomAngle(),
      finalRotationY: getRandomAngle(),
      finalRotationZ: getRandomAngle(),
    });
    shapes[1].rotation = rotation;
  };

  rotateReferenceShape();
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
          onKeyboardObservable={(...args: any[]) => console.log(args)}
          onPointerDown={(...args) => console.log(args)}
          onScenePointerDown={(...args) => console.log(args)}
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
