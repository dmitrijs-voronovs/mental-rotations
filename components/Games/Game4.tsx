// TODO: remove when not debugging
// import "@babylonjs/inspector";
import {
  Angle,
  Color3,
  Color4,
  EventState,
  KeyboardEventTypes,
  KeyboardInfo,
  Mesh,
  Quaternion,
  Tools,
  Vector3,
} from "@babylonjs/core";
import React from "react";
import { Engine, Scene, SceneEventArgs } from "react-babylonjs";
import s from "../../styles/Proto.App.module.scss";
import classNames from "classnames";
import {
  positionConfig,
  PositionConfigEntity,
} from "../../utils/positionConfig";
import {
  areQuaternionEqual,
  cleanUp,
  createBoxes,
  createCameras,
  generateFigures,
  launchTimer,
} from "../../utils/GenerateScene";
import { CorrectAnswer, createEvent } from "../../utils/Events";
import { EventDisplay } from "@components/EventDisplay";
import { generateGUI } from "../../utils/GenerateGUI";
import { GUI } from "dat.gui";
import { GENERATION_SETTINGS_KEY } from "@components/Games/Game3";
import { defaultConfig, GenerationConfig } from "../../utils/GenerateFigure";
import { getCameraName } from "../../utils/names";
import { data } from "browserslist";

function createScreenshot(
  canvas: HTMLCanvasElement,
  segment: number[],
  segmentWidth: number,
  segmentHeight: number
): string {
  const hiddenCanvas = document.createElement("canvas");
  hiddenCanvas.height = segmentHeight;
  hiddenCanvas.width = segmentWidth;
  hiddenCanvas
    .getContext("2d")!
    .drawImage(
      canvas,
      segmentWidth * segment[0],
      segmentHeight * segment[1],
      segmentWidth,
      segmentHeight,
      0,
      0,
      segmentWidth,
      segmentHeight
    );
  return hiddenCanvas.toDataURL("image/png", 0.9);
}

function createScreenshots(canvas: HTMLCanvasElement): string[] {
  const segmentWidth = canvas.width / 5;
  const segmentHeight = canvas.height / 3;
  const segments = [
    [1, 0],
    [3, 0],
    [2, 1],
    [0, 2],
    [1, 2],
    [2, 2],
    [3, 2],
    [4, 2],
  ];
  return segments.map((segment) =>
    createScreenshot(canvas, segment, segmentWidth, segmentHeight)
  );
}

const onKeyDown = (
  eventInfo: KeyboardInfo,
  eventState: EventState,
  sceneEventArgs: SceneEventArgs,
  meshes: Mesh[],
  camerasConfig: PositionConfigEntity[],
  timer: ReturnType<typeof launchTimer>,
  prepareScene: () => void
) => {
  const key = eventInfo.event.key;
  if (eventInfo.type === KeyboardEventTypes.KEYDOWN) {
    switch (true) {
      case !Number.isNaN(Number(key)):
        const numKey = Number(key);
        if (numKey >= 1 && numKey <= 5) {
          document.dispatchEvent(createEvent("actualAnswer", numKey));
          const time = timer.stopTimer();
          console.log({ key: numKey, time });
          cleanUp(sceneEventArgs, meshes);
          prepareScene();
        }
        return;
      case key === "h":
        document.dispatchEvent(createEvent("help"));
        return;
      case key === "p":
        const screenshots = createScreenshots(sceneEventArgs.canvas);
        document.dispatchEvent(createEvent("print", screenshots));
        return;
      default:
        console.log(key);
        return;
    }
  }
};

function getShapeConfig(gui?: GUI): GenerationConfig {
  if (!gui) return defaultConfig;
  const config = (gui.getSaveObject() as any).remembered[
    GENERATION_SETTINGS_KEY
  ][0];
  console.log(config);
  return config;
}

function createScene(sceneEventArgs: SceneEventArgs, gui?: GUI) {
  const { scene, canvas } = sceneEventArgs;
  createCameras(sceneEventArgs, positionConfig);
  let boxes: Mesh[];

  let timer: ReturnType<typeof launchTimer>;

  function prepareScene() {
    boxes = createBoxes(sceneEventArgs, positionConfig);
    const shapeConfig = getShapeConfig(gui);
    generateFigures(boxes, sceneEventArgs, shapeConfig);
    timer = launchTimer();
  }

  prepareScene();

  scene.onKeyboardObservable.add((eventInfo, eventState) =>
    onKeyDown(
      eventInfo,
      eventState,
      sceneEventArgs,
      boxes,
      positionConfig,
      timer,
      prepareScene
    )
  );
}

const Game4 = () => {
  const onSceneMount = (sceneEventArgs: SceneEventArgs) => {
    // const { scene } = sceneEventArgs;
    const gui = generateGUI(sceneEventArgs);
    // scene.onDisposeObservable.add(() => gui.destroy());
    // createAxis(sceneEventArgs, AXIS_SIZE);
    createScene(sceneEventArgs, gui);
    // sceneEventArgs.scene.debugLayer.show();
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
      <EventDisplay />
      <Engine
        engineOptions={{ preserveDrawingBuffer: true, stencil: true }}
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
            groundColor={Color3.White()}
            specular={Color3.Black()}
          />
        </Scene>
      </Engine>
    </>
  );
};

export default Game4;
