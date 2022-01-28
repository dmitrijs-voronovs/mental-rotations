import { SceneEventArgs } from "react-babylonjs";
import { createAxis, deleteAxis } from "@components/Axis/axisHelper";
import {
  clearFigure,
  defaultConfig,
  generateFigure,
  GenerationConfig,
} from "./GenerateFigure";
import { GUI } from "dat.gui";

export type GuiConfigDefinition = GenerationConfig & {
  clearAndGenerate(): void;
  save: () => void;
  generateFigure(): void;
  clearFigure: () => void;
  spreadMin: number;
  spreadMax: number;
  spreadStep: number;
  totalBlocksMax: number;
  totalBlocksMin: number;
  totalBlocksStep: number;
  maxDeltaForNextBlockMin: number;
  maxDeltaForNextBlockMax: number;
  maxDeltaForNextBlockStep: number;
  finalRotationXMin: number;
  finalRotationXMax: number;
  finalRotationXStep: number;
  finalRotationYMin: number;
  finalRotationYMax: number;
  finalRotationYStep: number;
  finalRotationZMin: number;
  finalRotationZMax: number;
  finalRotationZStep: number;
};

export const defaultGuiConfig: Omit<
  GuiConfigDefinition,
  keyof GenerationConfig
> = {
  clearAndGenerate: () => {},
  save: () => {},
  generateFigure: () => {},
  clearFigure: () => {},
  spreadMin: 0,
  spreadMax: 1,
  spreadStep: 0.01,
  totalBlocksMax: 50,
  totalBlocksMin: 2,
  totalBlocksStep: 1,
  maxDeltaForNextBlockMin: 1,
  maxDeltaForNextBlockMax: 3,
  maxDeltaForNextBlockStep: 1,
  finalRotationXMin: 0,
  finalRotationXMax: 360,
  finalRotationXStep: 1,
  finalRotationYMin: 0,
  finalRotationYMax: 360,
  finalRotationYStep: 1,
  finalRotationZMin: 0,
  finalRotationZMax: 360,
  finalRotationZStep: 1,
};

export const AXIS_SIZE = 5;
const GENERATION_SETTINGS_KEY = "Default";

const INITIAL_SETTINGS_KEY = "initial";
export type Position = { top: number; left: number };

function placeGui(
  gui: GUI,
  canvas: HTMLCanvasElement,
  position: Position = { top: 30, left: 30 }
) {
  // GUI placement
  gui.domElement.id = "datGUI";
  gui.useLocalStorage = true;
  const canvasPlacement = canvas.getBoundingClientRect();
  gui.domElement.style.position = "absolute";
  gui.domElement.style.top = "0";
  gui.domElement.style.left = "0";
  gui.domElement.style.marginTop = `${canvasPlacement.top + position.top}px`;
  gui.domElement.style.marginLeft = `${canvasPlacement.left + position.left}px`;
}

function populateGui(gui: GUI, fieldConfig: GuiConfigDefinition) {
  ["spreadOnX", "spreadOnY", "spreadOnZ"].forEach((fieldName) => {
    gui.add(
      fieldConfig,
      fieldName,
      fieldConfig.spreadMin,
      fieldConfig.spreadMax,
      fieldConfig.spreadStep
    );
  });
  [
    "totalBlocks",
    "finalRotationX",
    "finalRotationY",
    "finalRotationZ",
    "maxDeltaForNextBlock",
  ].forEach((fieldName) => {
    gui.add(
      fieldConfig,
      fieldName,
      //@ts-ignore
      fieldConfig[`${fieldName}Min`] ?? 0,
      //@ts-ignore
      fieldConfig[`${fieldName}Max`] ?? 100,
      //@ts-ignore
      fieldConfig[`${fieldName}Step`] ?? 1
    );
  });
  [
    "showAxis",
    "save",
    "generateFigure",
    "clearFigure",
    "clearAndGenerate",
  ].forEach((fieldName) => {
    gui.add(fieldConfig, fieldName);
  });
}

const GUI_NAME = "My GUI";
export const generateGUI = (
  sceneEventArgs: SceneEventArgs,
  position?: Position
): GUI => {
  const { canvas } = sceneEventArgs;

  const gui = new GUI({ name: GUI_NAME });

  placeGui(gui, canvas, position);
  // GUI values
  const fieldConfig = {
    ...defaultGuiConfig,
    ...defaultConfig,
    // functions
    save: () => gui.saveAs(GENERATION_SETTINGS_KEY),
    generateFigure() {
      this.save();
      const config = (gui.getSaveObject() as any).remembered[
        GENERATION_SETTINGS_KEY
      ][0];
      generateFigure(sceneEventArgs, config);
      if (config.showAxis) {
        createAxis(sceneEventArgs, AXIS_SIZE);
      } else {
        deleteAxis(sceneEventArgs);
      }
    },
    clearFigure: () => clearFigure(sceneEventArgs),
    clearAndGenerate() {
      this.clearFigure();
      this.generateFigure();
    },
  };

  gui.remember(fieldConfig);
  gui.saveAs(INITIAL_SETTINGS_KEY);

  populateGui(gui, fieldConfig);
  gui.save();

  return gui;
};
