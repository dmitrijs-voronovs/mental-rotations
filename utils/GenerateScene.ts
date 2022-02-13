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
  generateFigure,
  generateRotation,
  GenerationConfig,
  recenterMesh,
  resetBoundingInfo,
  SHAPE_SIZE,
  updateBoundingInfo,
} from "./GenerateFigure";
import { getBoxName, getCameraName, getTransformNodeName } from "./names";
import {
  defaultPositionConfig,
  POSITION_MULTIPLIER,
  PositionConfigEntity,
} from "./positionConfig";
import { dispatchProjectEvent } from "./Events";
import { createScreenshots } from "./CreateScreenshots";

export function createCameras(
  sceneEventArgs: SceneEventArgs,
  config: PositionConfigEntity[]
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

    return camera;
  });
}

export function createBoxes(
  sceneEventArgs: SceneEventArgs,
  camerasConfig: PositionConfigEntity[]
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
    box.edgesWidth = 6;
    box.edgesColor = Color4.FromColor3(Color3.Black(), 1);

    const material =
      (scene.getMaterialByName(`box-material`) as StandardMaterial) ||
      new StandardMaterial(`box-material`, scene);
    material.diffuseColor = new Color3(0.9, 0.9, 0.9);
    material.specularColor = Color3.White();
    box.material = material;

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

const getBaseFigureConfig = (
  source: Mesh,
  config?: GenerationConfig
): GenerationConfig => ({
  ...(config ?? defaultConfig),
  originX: source.position.x,
  originY: source.position.y,
});

export const cleanUp = (sceneEventArgs: SceneEventArgs, meshes: Mesh[]) => {
  const { scene } = sceneEventArgs;
  meshes.forEach((shape) => {
    const shapeName = shape.name;
    const transformNode = scene.getTransformNodeByName(
      getTransformNodeName(shapeName)
    );
    if (transformNode) {
      const allMeshes = transformNode.getChildMeshes(false);
      allMeshes.forEach((mesh) => scene.removeMesh(mesh));
      scene.removeTransformNode(transformNode);
    }
  });
};

const rotateReferenceShape = (
  source: Mesh,
  target: Mesh,
  options?: { toAngle?: Vector3; ignoreAngles?: Vector3[] }
): Vector3 => {
  resetBoundingInfo(target);

  const { position, name } = target;
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

const rotateReferenceShapes = (
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

function getAngleOfVector(dimension: "x" | "y" | "z", vector: Vector3) {
  const ang = Angle.FromRadians(vector[dimension]).degrees();
  return ang > 180 ? 180 - ang : ang;
}

export const generateFigures = (
  boxes: Mesh[],
  sceneEventArgs: SceneEventArgs,
  shapeConfig: GenerationConfig
) => {
  const configReferenceShape = getBaseFigureConfig(boxes[0], shapeConfig);
  dispatchProjectEvent("configurationSet", {
    isForReferenceShape: true,
    config: configReferenceShape,
  });

  generateFigure(sceneEventArgs, configReferenceShape, boxes[0].name);
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
  generateFigure(sceneEventArgs, configTestShape, boxes[2].name);
  const screenshots = createScreenshots(sceneEventArgs.canvas);
  dispatchProjectEvent("sceneCreated", {
    referenceShape: screenshots[0],
    referenceShapeRotated: screenshots[1],
    testShape: screenshots[2],
    testShape1: screenshots[3],
    testShape2: screenshots[4],
    testShape3: screenshots[5],
    testShape4: screenshots[6],
    testShape5: screenshots[7],
  });

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
};
