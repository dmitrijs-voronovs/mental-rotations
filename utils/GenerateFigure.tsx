import {
  Angle,
  ArcRotateCamera,
  InstancedMesh,
  Mesh,
  Scalar,
  TransformNode,
  Vector3,
} from "@babylonjs/core";
import { SceneEventArgs } from "react-babylonjs";
import { getRandomInt } from "./common";
import { getInstanceName, getTransformNodeName } from "./names";

export const SHAPE_NAME = "box-figure";
export const SHAPE_SIZE = 2;
const SHAPE_INITIAL_COORDS = new Vector3(0, 0, 0);

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
  showAxis: false,
};

export function resetBoundingInfo(square: Mesh) {
  square.refreshBoundingInfo();
  square.computeWorldMatrix(true);
  square
    .getBoundingInfo()
    .boundingBox.reConstruct(Vector3.Zero(), Vector3.Zero());
  square
    .getBoundingInfo()
    .boundingSphere.reConstruct(Vector3.Zero(), Vector3.Zero());
}

export function updateBoundingInfo(square: Mesh) {
  const { min, max } = square.getHierarchyBoundingVectors(true);

  square.getBoundingInfo().boundingBox.reConstruct(min, max);
  square.getBoundingInfo().boundingSphere.reConstruct(min, max);
}

export function recenterMesh(mesh: Mesh) {
  const center = mesh.getBoundingInfo().boundingBox.center;
  const parent = mesh.parent! as TransformNode;
  parent.position = parent.position.add(parent.position.subtract(center));
}

export function adjustCameraRadiusToFitMesh(
  mesh: Mesh,
  camera: ArcRotateCamera
) {
  resetBoundingInfo(mesh);
  updateBoundingInfo(mesh);

  const meshRadius = mesh.getBoundingInfo().boundingSphere.radius;
  const margin = 4;
  // TODO: replace with something more reliable. Change formula to suit any camera fov
  // // camera.fov = 0.1;
  // const fovMultiplier = 8 - camera.fov;
  // // const fovMultiplier = 1;
  // camera.radius = meshRadius * 2 * fovMultiplier + margin * 8;
  const fovMultiplier = 2 - camera.fov;
  camera.radius = meshRadius * 2 * fovMultiplier + margin;
}

export const generateFigure = (
  sceneEventArgs: SceneEventArgs,
  config: GenerationConfig,
  shapeName = SHAPE_NAME,
  withInstance?: (inst: InstancedMesh) => void
) => {
  const { scene } = sceneEventArgs;
  const square = scene.getMeshByName(shapeName) as Mesh;
  resetBoundingInfo(square);

  const submeshCoordinates = generateCoordinatesOfSubmeshes(config);

  const rotation = generateRotation(config);
  submeshCoordinates.forEach((coord, i) => {
    const inst = square.createInstance(getInstanceName(shapeName, i));
    inst.setParent(square);
    inst.scalingDeterminant = 0.97;
    inst.position = coord;
    inst.isPickable = true;

    if (withInstance) withInstance(inst);
  });
  square.edgesShareWithInstances = true;
  square.rotation = rotation;

  let parent = square.parent as TransformNode;
  // TODO: move that to make specific to game2?
  if (!parent) {
    const parentName = getTransformNodeName(square.name);
    parent =
      scene.getTransformNodeByName(parentName) ?? new TransformNode(parentName);
    square.parent = parent;
  }

  updateBoundingInfo(square);
  recenterMesh(square);
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
  );

const generateCoordinatesOfSubmeshes = (
  config: GenerationConfig
): Vector3[] => {
  const { totalBlocks } = config;

  const allCoords: Vector3[] = [SHAPE_INITIAL_COORDS];
  let nBlocksToGenerate = totalBlocks - 1;
  while (nBlocksToGenerate > 0) {
    const randomDeltaVector = getRandomVector(config);
    const newCoords = getNewCoords(allCoords, randomDeltaVector);
    if (newCoords) {
      allCoords.push(newCoords);
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
    .reduce((resultingVector, vector) => resultingVector.add(vector))
    .scale(SHAPE_SIZE);
};

const getNewCoords = (
  existingCoords: Vector3[],
  deltaVector: Vector3
): Vector3 | null => {
  const usedCoords: number[] = [];
  let isOverlapping = true;
  let newCoords: Vector3 = Vector3.Zero();
  while (isOverlapping && usedCoords.length < existingCoords.length) {
    const randomExistingCordIdx = getRandomInt(existingCoords.length);
    // TODO: improve not to restart, but to find closest non-used value
    if (usedCoords.includes(randomExistingCordIdx)) {
      continue;
    } else {
      usedCoords.push(randomExistingCordIdx);
    }
    newCoords = existingCoords[randomExistingCordIdx].add(deltaVector);
    isOverlapping = existingCoords.some(
      (existingCoord) => existingCoord.toString() === newCoords.toString()
    );
  }
  return !isOverlapping ? newCoords : null;
};
