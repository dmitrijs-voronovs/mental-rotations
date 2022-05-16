import {
  Angle,
  ArcRotateCamera,
  Color3,
  Color4,
  Mesh,
  MeshBuilder,
  Quaternion,
  Scalar,
  StandardMaterial,
  TransformNode,
  Vector3,
  Viewport,
} from "@babylonjs/core";
import { SceneEventArgs } from "react-babylonjs";
import {
  defaultConfig,
  generateRotation,
  GenerationConfig,
  recenterMesh,
  resetBoundingInfo,
  SHAPE_SIZE,
  updateBoundingInfo,
} from "./GenerateFigure";
import {
  getBoxName,
  getCameraName,
  getTransformNodeName,
} from "@utils/GetNames";
import {
  defaultPositionConfig,
  POSITION_MULTIPLIER,
  PositionConfigEntity,
} from "../../../config/PositionConfig";

export function createCameras(
  sceneEventArgs: SceneEventArgs,
  config: PositionConfigEntity[],
  withCamera?: (camera: ArcRotateCamera) => void
): ArcRotateCamera[] {
  const { scene, canvas } = sceneEventArgs;
  return config.map((configRaw, i) => {
    const config = { ...configRaw, ...defaultPositionConfig };
    const camera = new ArcRotateCamera(
      getCameraName(i),
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
    camera.inertia = 0.5;
    if (withCamera) withCamera(camera);

    return camera;
  });
}

export function createBoxes(
  sceneEventArgs: SceneEventArgs,
  camerasConfig: PositionConfigEntity[],
  withBox?: (box: Mesh) => void
) {
  const { scene } = sceneEventArgs;
  const shapes = camerasConfig.map((configRaw, i) => {
    const config = { ...configRaw, ...defaultPositionConfig };
    const box = MeshBuilder.CreateBox(
      getBoxName(i),
      {
        size: SHAPE_SIZE,
      },
      scene
    );

    box.scaling = new Vector3(1, 1, 1);
    const parent = new TransformNode(getTransformNodeName(box.name), scene);
    box.parent = parent;
    parent.position = new Vector3(
      config.x! * POSITION_MULTIPLIER,
      config.y! * POSITION_MULTIPLIER,
      0
    );

    box.isVisible = false;
    box.enableEdgesRendering();
    box.edgesWidth = 10;
    box.edgesColor = Color4.FromColor3(Color3.Black(), 1);

    const material =
      (scene.getMaterialByName(`box-material`) as StandardMaterial) ||
      new StandardMaterial(`box-material`, scene);
    material.diffuseColor = new Color3(0.9, 0.9, 0.9);
    material.specularColor = Color3.White();
    box.material = material;

    if (withBox) withBox(box);

    return box;
  });
  return shapes;
}

function getRandomAngle() {
  const rotationTimes = Math.floor(Scalar.RandomRange(-2, 2));
  return rotationTimes * 90;
}

function generateRandomAngle(ignoreAngles?: Vector3[]) {
  let result = generateRotation({
    finalRotationX: getRandomAngle(),
    finalRotationY: getRandomAngle(),
    finalRotationZ: getRandomAngle(),
  });

  if (!ignoreAngles) return result;

  while (
    ignoreAngles.find((toIgnore) =>
      areQuaternionEqual(
        Quaternion.FromEulerVector(result),
        Quaternion.FromEulerVector(toIgnore)
      )
    )
  ) {
    result = generateRotation({
      finalRotationX: getRandomAngle(),
      finalRotationY: getRandomAngle(),
      finalRotationZ: getRandomAngle(),
    });
  }

  return result;
}

export const getBaseFigureConfig = (
  source: Mesh,
  config?: GenerationConfig
): GenerationConfig => ({
  ...(config ?? defaultConfig),
  originX: source.position.x,
  originY: source.position.y,
});

export const rotateReferenceShape = (
  source: Mesh,
  target: Mesh,
  options?: { toAngle?: Vector3; ignoreAngles?: Vector3[] }
): Vector3 => {
  resetBoundingInfo(target);

  const { name } = target;
  const parent = target.parent as TransformNode;
  target.dispose();
  target = source.clone(name, parent);

  const rotation =
    options?.toAngle || generateRandomAngle(options?.ignoreAngles);
  target.rotationQuaternion = Quaternion.FromEulerVector(rotation);

  updateBoundingInfo(target);
  recenterMesh(target);

  return rotation;
};

export function areQuaternionEqual(q1: Quaternion, q2: Quaternion) {
  const dotProd = Math.abs(Quaternion.Dot(q1, q2));
  const threshold = 1e-5;
  return 1 - threshold < dotProd;
}

export const rotateReferenceShapes = (
  source: Mesh,
  targets: Mesh[],
  correctRotation: Vector3,
  correctShapeIdx: number
) => {
  const existingAngles = [correctRotation, Vector3.Zero()];
  targets.forEach((target, idx) => {
    target.computeWorldMatrix(true);
    const angle = rotateReferenceShape(
      source,
      target,
      idx === correctShapeIdx
        ? { toAngle: correctRotation }
        : { ignoreAngles: existingAngles }
    );
    existingAngles.push(angle);
  });
};

export function getAngleOfVector(dimension: "x" | "y" | "z", vector: Vector3) {
  const ang = Angle.FromRadians(vector[dimension]).degrees();
  return ang > 180 ? 180 - ang : ang;
}
