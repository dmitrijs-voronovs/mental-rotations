// TODO: remove when not debugging
// import "@babylonjs/inspector";
import {
  Color3,
  Color4,
  Mesh,
  PointerEventTypes,
  Vector3,
} from "@babylonjs/core";
import React, { useEffect } from "react";
import { Engine, Scene, SceneEventArgs } from "react-babylonjs";
import s from "../../styles/Proto.App.module.scss";
import classNames from "classnames";
import { positionConfig } from "../../utils/positionConfig";
import {
  cleanUp,
  createBoxes,
  createCameras,
  generateFigures,
} from "../../utils/GenerateScene";
import { EventDisplay } from "@components/EventDisplay";
import {
  generateGUI,
  GENERATION_SETTINGS_KEY,
  GuiConfig,
} from "../../utils/GenerateGUI";
import { GUI } from "dat.gui";
import {
  defaultConfig,
  GenerationConfig,
  scaleMeshToFitScreen,
} from "../../utils/GenerateFigure";
import { launchTimer } from "../../utils/LaunchTimer";
import { createKeyboardEventHandler } from "@components/Games/EventManager/CreateKeyboardEventHandler";
import { getBoxName } from "../../utils/names";
import { dispatchProjectEvent } from "../../utils/Events";

function getConfigFromGui(gui: GUI) {
  const rawConfig = (gui.getSaveObject() as any).remembered[
    GENERATION_SETTINGS_KEY
  ][0] as GuiConfig;
  return Object.entries(rawConfig).reduce<any>((result, [k, v]) => {
    if (typeof v !== "function") {
      result[k] = v;
    }
    return result;
  }, {} as GenerationConfig);
}

function getShapeConfig(gui?: GUI): GenerationConfig {
  if (!gui) return defaultConfig;
  return getConfigFromGui(gui);
}

function createScene(sceneEventArgs: SceneEventArgs, gui?: GUI) {
  const { scene, canvas } = sceneEventArgs;
  const cameras = createCameras(sceneEventArgs, positionConfig);
  let boxes: Mesh[];
  const timer = launchTimer();

  function prepareScene() {
    boxes = createBoxes(sceneEventArgs, positionConfig);
    const shapeConfig = getShapeConfig(gui);
    generateFigures(boxes, sceneEventArgs, shapeConfig);
    cameras.forEach((camera, i) => {
      // get meshes from world / instead of directly to make sure new props are included
      const relatedMesh = scene.getMeshByName(getBoxName(i))! as Mesh;
      scaleMeshToFitScreen(relatedMesh, camera);
    });
    timer.restartTimer();
  }

  prepareScene();

  const KeyboardEventHandler = createKeyboardEventHandler(sceneEventArgs, {
    timer,
    prepareScene,
    boxes: boxes!,
  });

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
        const pickedMesh = Math.ceil(pointerInfo.event.clientX / segmentWidth);

        // const marker = document.createElement("div");
        // marker.style.position = "absolute";
        // marker.style.width = "10px";
        // marker.style.height = "10px";
        // marker.style.left = pointerInfo.event.clientX + "px";
        // marker.style.top = pointerInfo.event.clientY + "px";
        // marker.style.background = "red";
        // marker.style.borderRadius = "50%";
        // document.body.appendChild(marker);
        console.log(pickedMesh);
        const time = timer.stopTimer();
        dispatchProjectEvent("actualAnswer", { answer: pickedMesh, time });

        cleanUp(sceneEventArgs, boxes);
        prepareScene();
        // console.log(scene.pick());
        break;
      // case PointerEventTypes.POINTERUP:
      //   pointerUp();
      //   break;
      // case PointerEventTypes.POINTERMOVE:
      //   pointerMove();
      //   break;
    }
  });
}

const onSceneMount = (sceneEventArgs: SceneEventArgs) => {
  // const { canvas } = sceneEventArgs;
  const gui = generateGUI(sceneEventArgs);
  // scene.onDisposeObservable.add(() => gui.destroy());
  // createAxis(sceneEventArgs, AXIS_SIZE);
  createScene(sceneEventArgs, gui);
  // sceneEventArgs.scene.debugLayer.show();
};

const CANVAS_ID = "babylonJS";

const Test = () => {
  useEffect(() => {
    const canvas = document.getElementById(CANVAS_ID)!;
    canvas.tabIndex = 0;
    canvas.focus();
  }, []);

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
        canvasId={CANVAS_ID}
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

export default Test;
