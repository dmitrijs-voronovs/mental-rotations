import {
  ArcRotateCamera,
  Color3,
  Color4,
  Mesh,
  TransformNode,
  Vector3,
} from "@babylonjs/core";
import React from "react";
import { Engine, Scene, SceneEventArgs } from "react-babylonjs";
import { createAxis } from "@components/Axis/axisHelper";
import { Container } from "@components/common/Container";
import {
  adjustCameraRadiusToFitMesh,
  SHAPE_NAME,
  SHAPE_SIZE,
} from "../../utils/GenerateFigure";
import { generateGUI } from "../../utils/GenerateGUI";

const AXIS_SIZE = 5;

const CAMERA_NAME = "camera1";

function prepareScene(scene: SceneEventArgs["scene"]) {
  const camera = scene.getCameraByName(CAMERA_NAME) as ArcRotateCamera;
  const mesh = scene.getMeshByName(SHAPE_NAME) as Mesh;
  if (camera && mesh) {
    camera.inertia = 0.5;
    adjustCameraRadiusToFitMesh(mesh, camera);
  }
}

const ConfigurationEditor = () => {
  const onSceneMount = (sceneEventArgs: SceneEventArgs) => {
    const { scene } = sceneEventArgs;

    const gui = generateGUI(sceneEventArgs, {
      generateFigureCallback: () => {
        prepareScene(scene);
      },
      clearFigureCallback: () => {
        const shape = scene.getMeshByName(SHAPE_NAME);
        if (shape && shape.parent) {
          (shape.parent as TransformNode).position = Vector3.Zero();
        }
      },
    });
    createAxis(sceneEventArgs, AXIS_SIZE);
    import("@babylonjs/inspector").then(() => scene.debugLayer.show());

    // TODO: add to other editors
    scene.onDisposeObservable.add(() => gui.destroy());
  };

  return (
    <Container>
      <h2>
        Stage 2 - Created algorithm for generation random 3d Shapes and its
        dynamic configuration
      </h2>
      <div style={{ position: "relative", display: "flex", flex: "1" }}>
        <Engine
          antialias
          adaptToDeviceRatio
          canvasId="babylonJS"
          debug
          canvasStyle={{
            flex: "1 0",
            display: "flex",
            width: "75vw",
            height: "70vh",
            paddingBottom: "4rem",
          }}
        >
          <Scene
            key="scene2"
            onSceneMount={onSceneMount}
            clearColor={Color4.FromColor3(Color3.White())}
          >
            <arcRotateCamera
              name={CAMERA_NAME}
              target={Vector3.Zero()}
              alpha={Math.PI / 3}
              beta={Math.PI / 3}
              radius={20}
            />
            <hemisphericLight
              name="light1"
              intensity={1}
              direction={Vector3.Up()}
              groundColor={Color3.White()}
              specular={Color3.Black()}
            />
            <box
              isVisible={false}
              name={SHAPE_NAME}
              size={SHAPE_SIZE}
              enableEdgesRendering
              edgesWidth={10}
              edgesColor={Color4.FromColor3(Color3.Black(), 1)}
              position={new Vector3(0, 3, 0)}
              scaling={new Vector3(1, 1, 1)}
            >
              <standardMaterial
                name={`random-box-mat`}
                diffuseColor={new Color3(0.9, 0.9, 0.9)}
                specularColor={Color3.White()}
              />
            </box>
            <ground
              name="ground"
              visibility={0}
              height={10}
              width={10}
              position={new Vector3(0, -5, 0)}
            >
              <standardMaterial
                name={`random-box-mat`}
                diffuseColor={Color3.Black()}
                specularColor={Color3.Black()}
              />
            </ground>
          </Scene>
        </Engine>
      </div>
    </Container>
  );
};

export default ConfigurationEditor;
