// TODO: remove when not debugging
// import "@babylonjs/inspector";
import { Color3, Color4, Mesh, Vector3 } from "@babylonjs/core";
import React from "react";
import { Engine, Scene, SceneEventArgs } from "react-babylonjs";
import s from "../../styles/Proto.App.module.scss";
import classNames from "classnames";
import { positionConfig } from "../../utils/positionConfig";
import {
  createBoxes,
  createCameras,
  generateFigures,
} from "../../utils/GenerateScene";
import { EventDisplay } from "@components/EventDisplay";
import { generateGUI } from "../../utils/GenerateGUI";
import { GUI } from "dat.gui";
import { GENERATION_SETTINGS_KEY } from "@components/Games/Game3";
import { defaultConfig, GenerationConfig } from "../../utils/GenerateFigure";
import { launchTimer, Timer } from "../../utils/LaunchTimer";
import { createKeyboardEventHandler } from "@components/Games/EventManager/CreateKeyboardEventHandler";

function getShapeConfig(gui?: GUI): GenerationConfig {
  if (!gui) return defaultConfig;
  return (gui.getSaveObject() as any).remembered[GENERATION_SETTINGS_KEY][0];
}

function createScene(sceneEventArgs: SceneEventArgs, gui?: GUI) {
  const { scene } = sceneEventArgs;
  createCameras(sceneEventArgs, positionConfig);
  let boxes: Mesh[];
  let timer = launchTimer();

  function prepareScene() {
    boxes = createBoxes(sceneEventArgs, positionConfig);
    const shapeConfig = getShapeConfig(gui);
    generateFigures(boxes, sceneEventArgs, shapeConfig);
    timer.restartTimer();
  }

  prepareScene();

  const KeyboardEventHandler = createKeyboardEventHandler(sceneEventArgs, {
    timer: timer,
    prepareScene,
    boxes: boxes!,
  });

  scene.onKeyboardObservable.add((eventInfo, eventState) =>
    KeyboardEventHandler.handleEvent(eventInfo, eventState)
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
