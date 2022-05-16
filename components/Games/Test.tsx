import {Color3, Color4, Vector3} from "@babylonjs/core";
import React, {FC, useEffect} from "react";
import {Engine, Scene, SceneEventArgs} from "react-babylonjs";
import s from "../../styles/Proto.App.module.scss";
import classNames from "classnames";
import {EventDisplay} from "@components/EventDisplay";
import {generateGUI, GENERATION_SETTINGS_KEY, GuiConfig} from "@utils/SceneHelpers/SceneGenerators/GenerateGUI";
import {SceneInitializerCreator} from "@utils/SceneHelpers/SceneInitializer/ISceneInitializer";
import type {GUI} from "dat.gui";
import {defaultConfig, GenerationConfig,} from "@utils/SceneHelpers/SceneGenerators/GenerateFigure";

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

export function getShapeConfig(gui?: GUI): GenerationConfig {
  if (!gui) return defaultConfig;
  return getConfigFromGui(gui);
}

const onSceneMount = async (
  sceneEventArgs: SceneEventArgs,
  SceneFactory: SceneInitializerCreator
) => {
  const gui = generateGUI(sceneEventArgs);
  new SceneFactory(sceneEventArgs, gui).init();
  sceneEventArgs.scene.onDisposeObservable.add(() => gui.destroy());

  // import("@babylonjs/inspector").then(() => sceneEventArgs.scene.debugLayer.show());
};

const CANVAS_ID = "babylonJS";

const Test: FC<{
  SceneFactory: SceneInitializerCreator;
}> = ({ SceneFactory }) => {
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
          onSceneMount={(scene) => onSceneMount(scene, SceneFactory)}
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
