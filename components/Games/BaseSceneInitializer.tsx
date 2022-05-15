import { SceneEventArgs } from "react-babylonjs";
import { GUI } from "dat.gui";
import { InstancedMesh, Mesh, Scalar, Vector3 } from "@babylonjs/core";
import { generateFigure, GenerationConfig } from "../../utils/GenerateFigure";
import {
  getAngleOfVector,
  getBaseFigureConfig,
  rotateReferenceShape,
  rotateReferenceShapes,
} from "../../utils/GenerateScene";
import { dispatchProjectEvent } from "../../utils/Events";
import { ISceneInitializer } from "@components/Games/ISceneInitializer";

export abstract class BaseSceneInitializer implements ISceneInitializer {
  constructor(public sceneEventArgs: SceneEventArgs, public gui?: GUI) {}

  abstract init(): void;

  shouldGenerateFigures() {
    return true;
  }

  generateFigures(
    boxes: Mesh[],
    sceneEventArgs: SceneEventArgs,
    shapeConfig: GenerationConfig,
    withInstance?: (inst: InstancedMesh) => void
  ) {
    if (!this.shouldGenerateFigures()) return;

    const configReferenceShape = getBaseFigureConfig(boxes[0], shapeConfig);
    dispatchProjectEvent("configurationSet", {
      isForReferenceShape: true,
      config: configReferenceShape,
    });

    generateFigure(
      sceneEventArgs,
      configReferenceShape,
      boxes[0].name,
      withInstance
    );
    const correctAngle = rotateReferenceShape(boxes[0], boxes[1], {
      ignoreAngles: [Vector3.Zero()],
    });

    dispatchProjectEvent("rotationAnglesSet", {
      x: getAngleOfVector("x", correctAngle),
      y: getAngleOfVector("y", correctAngle),
      z: getAngleOfVector("z", correctAngle),
    });

    const configTestShape = getBaseFigureConfig(boxes[2], shapeConfig);
    dispatchProjectEvent("configurationSet", {
      isForReferenceShape: false,
      config: configTestShape,
    });
    generateFigure(
      sceneEventArgs,
      configTestShape,
      boxes[2].name,
      withInstance
    );
    const meshesToRotate = [boxes[3], boxes[4], boxes[5], boxes[6], boxes[7]];
    const correctShapeIdx = Math.floor(
      Scalar.RandomRange(0, meshesToRotate.length)
    );

    dispatchProjectEvent("correctAnswer", correctShapeIdx + 1);
    rotateReferenceShapes(
      boxes[2],
      meshesToRotate,
      correctAngle,
      correctShapeIdx
    );
  }
}
