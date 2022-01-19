import { Angle, Mesh, Scalar, TransformNode, Vector3 } from "@babylonjs/core";
import { SceneEventArgs } from "react-babylonjs";
import { getRandomInt } from "./common";
import { getInstanceName, getTransformNodeName } from "./names";

export const SHAPE_NAME = "box-figure";
export const SHAPE_SIZE = 2;
const SHAPE_INITIAL_COORD = new Vector3(0, 0, 0);

const SHAPE_PARENT_NAME = "figure_parent";

export type GenerationConfig = {
  spreadOnX: number;
  spreadOnY: number;
  spreadOnZ: number;
  totalBlocks: number;
  maxDeltaForNextBlock: number;
  finalRotationX: number;
  finalRotationY: number;
  finalRotationZ: number;
  originX: number;
  originY: number;
  originZ: number;
  showAxis: boolean;
};

export const defaultConfig: GenerationConfig = {
  spreadOnX: 0.5,
  spreadOnY: 0.5,
  spreadOnZ: 0.5,
  totalBlocks: 8,
  maxDeltaForNextBlock: 1,
  finalRotationX: 0,
  finalRotationY: 0,
  finalRotationZ: 0,
  originX: 0,
  originY: 0,
  originZ: 0,
  showAxis: true,
};

export function resetBoundingInfo(square: Mesh) {
  square
    .getBoundingInfo()
    .boundingBox.reConstruct(Vector3.Zero(), Vector3.Zero());
}

export function updateBoundingInfo(square: Mesh) {
  const { min, max } = square.getHierarchyBoundingVectors();

  square.getBoundingInfo().boundingBox.reConstruct(min, max);
  // square.showBoundingBox = true;
  // square.showSubMeshesBoundingBox = true;
}

export function recenterMesh(
  parent: TransformNode,
  square: Mesh,
  config: Pick<GenerationConfig, "originX" | "originY" | "originZ">
) {
  const center = square.getBoundingInfo().boundingBox.center;
  const positionDiff = new Vector3(
    config.originX,
    config.originY,
    config.originZ
  ).subtract(center);
  parent.position = parent.position.add(positionDiff);
}

export const generateFigure = (
  sceneEventArgs: SceneEventArgs,
  config: GenerationConfig,
  shapeName = SHAPE_NAME
) => {
  const { scene } = sceneEventArgs;
  const square = scene.getMeshByName(shapeName) as Mesh;
  resetBoundingInfo(square);

  const newCoords = generateCoordinates(config);

  const rotation = generateRotation(config);
  newCoords.forEach((coord, i) => {
    const inst = square.createInstance(getInstanceName(shapeName, i));
    inst.setParent(square);
    inst.scalingDeterminant = 0.99;
    inst.position = coord;
  });
  square.edgesShareWithInstances = true;
  square.rotation = rotation;

  square.position = new Vector3(config.originX, config.originY, config.originZ);
  const parent =
    scene.getTransformNodeByName(getTransformNodeName(shapeName)) ||
    new TransformNode(getTransformNodeName(shapeName));
  square.setParent(parent);

  updateBoundingInfo(square);

  recenterMesh(parent, square, config);
};
export const clearFigure = (
  sceneEventArgs: SceneEventArgs,
  shapeName = SHAPE_NAME
) => {
  const { scene } = sceneEventArgs;
  const square = scene.getMeshByName(shapeName) as Mesh;
  while (square.instances?.length) {
    square.instances.forEach((inst) => {
      inst.dispose();
    });
  }
  square.rotation = Vector3.Zero();
  // square.material?.dispose();
  // square.parent?.dispose();
  // square.dispose();
};

export const generateRotation = (
  config: Pick<
    GenerationConfig,
    "finalRotationZ" | "finalRotationY" | "finalRotationX"
  >
): Vector3 =>
  new Vector3(
    Angle.FromDegrees(config.finalRotationX).radians(),
    Angle.FromDegrees(config.finalRotationY).radians(),
    Angle.FromDegrees(config.finalRotationZ).radians()
    // ).scale(SHAPE_SIZE);
  );

const generateCoordinates = (config: GenerationConfig): Vector3[] => {
  const { totalBlocks } = config;

  const allCoords: Vector3[] = [SHAPE_INITIAL_COORD];
  let nBlocksToGenerate = totalBlocks - 1;
  while (nBlocksToGenerate > 0) {
    const randomDeltaVector = getRandomVector(config);
    const newCoord = getNewCoord(allCoords, randomDeltaVector);
    if (newCoord) {
      allCoords.push(newCoord);
      nBlocksToGenerate--;
    }
  }
  return allCoords;
};
const getRandomVector = (config: GenerationConfig): Vector3 => {
  const { maxDeltaForNextBlock, spreadOnX, spreadOnY, spreadOnZ } = config;
  const getValueOfRandomVector = (n: number): Vector3 => {
    const absN = Math.abs(n);
    switch (true) {
      case absN < spreadOnX:
        return new Vector3(1, 0, 0).scale(n >= 0 ? 1 : -1);
      case absN < spreadOnX + spreadOnY:
        return new Vector3(0, 1, 0).scale(n >= 0 ? 1 : -1);
      default:
        return new Vector3(0, 0, 1).scale(n >= 0 ? 1 : -1);
    }
  };
  let vectorsForNextPosition: Vector3[] = [];
  const deltaForNextBlock = getRandomInt(maxDeltaForNextBlock) + 1;
  const totalSpread = spreadOnX + spreadOnY + spreadOnZ;
  while (vectorsForNextPosition.length < deltaForNextBlock) {
    const randomN = Scalar.RandomRange(-totalSpread, totalSpread);
    const randomVector = getValueOfRandomVector(randomN);
    vectorsForNextPosition.push(randomVector);
  }
  return vectorsForNextPosition
    .reduce(
      (resultingVector, vector) =>
        (resultingVector = resultingVector.add(vector))
    )
    .scale(SHAPE_SIZE);
};
const getNewCoord = (
  existingCoords: Vector3[],
  deltaVector: Vector3
): Vector3 | null => {
  const usedCoords: number[] = [];
  let isOverlapping = true;
  let newCoord: Vector3 = Vector3.Zero();
  while (isOverlapping && usedCoords.length < existingCoords.length) {
    const randomExistingCordIdx = getRandomInt(existingCoords.length);
    // TODO: improve not to restart, but to find closest non-used value
    if (usedCoords.includes(randomExistingCordIdx)) {
      continue;
    } else {
      usedCoords.push(randomExistingCordIdx);
    }
    newCoord = existingCoords[randomExistingCordIdx].add(deltaVector);
    isOverlapping = existingCoords.some(
      (existingCoord) => existingCoord.toString() === newCoord.toString()
    );
  }
  return !isOverlapping ? newCoord : null;
};
