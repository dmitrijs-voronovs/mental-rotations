import "@babylonjs/inspector";
import { Color3, Mesh, Vector3 } from "@babylonjs/core";
import React from "react";
import { Engine, Scene, SceneEventArgs } from "react-babylonjs";
import { createAxis } from "@components/Axis/axisHelper";
import { Container } from "@components/common/Container";
import { SHAPE_NAME, SHAPE_SIZE } from "../../utils/GenerateFigure";
import { generateGUI } from "../../utils/GenerateGUI";

const AXIS_SIZE = 5;

const Game2 = () => {
  const onSceneMount = (sceneEventArgs: SceneEventArgs) => {
    const { scene } = sceneEventArgs;

    const gui = generateGUI(sceneEventArgs);
    createAxis(sceneEventArgs, AXIS_SIZE);
    scene.debugLayer.show();
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
          <Scene key="scene2" onSceneMount={onSceneMount}>
            <arcRotateCamera
              name="camera1"
              target={Vector3.Zero()}
              alpha={Math.PI / 3}
              beta={Math.PI / 3}
              radius={20}
            />
            <hemisphericLight
              name="light1"
              intensity={0.7}
              direction={Vector3.Up()}
            />
            <box
              onReady={(node) => {
                // (node as Mesh).showBoundingBox = true;
                // (node as Mesh).showSubMeshesBoundingBox = true;
              }}
              isVisible={false}
              name={SHAPE_NAME}
              size={SHAPE_SIZE}
              position={new Vector3(0, 3, 0)}
              scaling={new Vector3(1, 1, 1)}
            >
              <standardMaterial
                name={`random-box-mat`}
                diffuseColor={Color3.White()}
                specularColor={Color3.White()}
              />
            </box>
            <ground
              name="ground"
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

export default Game2;
