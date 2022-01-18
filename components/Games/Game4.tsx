import "@babylonjs/inspector";
import {AbstractMesh, ArcRotateCamera, Camera, Color3, Color4, Vector2, Vector3,} from '@babylonjs/core';
import React, {ComponentProps, useState} from 'react';
import {Engine, Scene, SceneEventArgs, useScene} from 'react-babylonjs';
import {isMobile} from 'react-device-detect';
import {createAxis} from '@components/Axis/axisHelper';
import {Container} from '@components/common/Container';
import {AXIS_SIZE, generateGUI} from "../../utils/GenerateGUI";
import {SHAPE_NAME, SHAPE_SIZE} from "../../utils/GenerateFigure";
import s from "../../styles/Proto.App.module.scss"
import classNames from "classnames";

type CameraConfig = Partial<ArcRotateCamera>

const defaultCameraConfig: CameraConfig = {
    name: "camera-r",
    alpha: Math.PI * .25,
    beta: Math.PI * .3,
    radius: 15,
    target:new Vector3(0,0,0),
}

const camerasConfig: CameraConfig[] = [{

}]

const Cameras = () => {
    const scene = useScene();
    const alwaysActive = (camera: Camera) => {
        if (scene) scene.activeCameras = [...(scene.activeCameras || []), camera];
        console.log(scene);
    };

    return (
        <>
            <arcRotateCamera
                name='camera1'
                alpha={Math.PI * .25}
                beta={Math.PI * .3}
                radius={15}
                target={new Vector3(1, 0, 0)}
                onCreated={alwaysActive}
            >
                <viewport x={0.2} y={.66} height={.33} width={.2}/>
            </arcRotateCamera>

            <arcRotateCamera
                name='camera2'
                alpha={Math.PI * .25}
                beta={Math.PI * .3}
                radius={15}
                target={new Vector3(3, 0, 0)}
                cameraRotation={new Vector2(10, 15)}
                onCreated={alwaysActive}
            >
                <viewport x={0.6} y={.66} height={.33} width={.2}/>
            </arcRotateCamera>
            <arcRotateCamera
                name='camera3'
                alpha={Math.PI * .25}
                beta={Math.PI * .3}
                radius={15}
                target={new Vector3(2, 1, 0)}
                cameraRotation={new Vector2(10, 15)}
                onCreated={alwaysActive}
            >
                <viewport x={0.4} y={.33} height={.33} width={.2}/>
            </arcRotateCamera>
            <arcRotateCamera
                name='camera4'
                alpha={Math.PI * .25}
                beta={Math.PI * .3}
                radius={15}
                target={new Vector3(0, 2, 0)}
                cameraRotation={new Vector2(10, 15)}
                onCreated={alwaysActive}
            >
                <viewport x={0} y={0} height={.33} width={.2}/>
            </arcRotateCamera>
            <arcRotateCamera
                name='camera5'
                alpha={Math.PI * .25}
                beta={Math.PI * .3}
                radius={15}
                target={new Vector3(1, 2, 0)}
                cameraRotation={new Vector2(10, 15)}
                onCreated={alwaysActive}
            >
                <viewport x={0.2} y={0} height={.33} width={.2}/>
            </arcRotateCamera>
            <arcRotateCamera
                name='camera6'
                alpha={Math.PI * .25}
                beta={Math.PI * .3}
                radius={15}
                target={new Vector3(2, 2, 0)}
                cameraRotation={new Vector2(10, 15)}
                onCreated={alwaysActive}
            >
                <viewport x={0.4} y={0} height={.33} width={.2}/>
            </arcRotateCamera>
            <arcRotateCamera
                name='camera7'
                alpha={Math.PI * .25}
                beta={Math.PI * .3}
                radius={15}
                target={new Vector3(3, 2, 0)}
                cameraRotation={new Vector2(10, 15)}
                onCreated={alwaysActive}
            >
                <viewport x={0.6} y={0} height={.33} width={.2}/>
            </arcRotateCamera>
            <arcRotateCamera
                name='camera8'
                alpha={Math.PI * .25}
                beta={Math.PI * .3}
                radius={15}
                target={new Vector3(4, 2, 0)}
                cameraRotation={new Vector2(10, 15)}
                onCreated={alwaysActive}
            >
                <viewport x={0.8} y={0} height={.33} width={.2}/>
            </arcRotateCamera>
        </>
    );
};

const Game4 = () => {
    const onSceneMount = (sceneEventArgs: SceneEventArgs) => {
        const {scene} = sceneEventArgs;
        const gui = generateGUI(sceneEventArgs);
        scene.onDisposeObservable.add(() => gui.destroy());
        createAxis(sceneEventArgs, AXIS_SIZE);
        // scene.debugLayer.show();
    };

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
            <Engine
                antialias
                adaptToDeviceRatio
                canvasId='babylonJS'
                canvasStyle={{
                    flex: '1',
                    display: 'flex',
                    width: '100vw',
                    height: '100vh',
                    "padding-bottom": "4rem"
                }}
                debug
            >
                <Scene
                    key='scene3'
                    onSceneMount={onSceneMount}
                    clearColor={Color4.FromColor3(Color3.White())}
                    onKeyboardObservable={(...args: any[]) => console.log(args)}
                    onPointerDown={(...args) => console.log(args)}
                    onScenePointerDown={(...args) => console.log(args)}
                >
                    <Cameras/>
                    <hemisphericLight
                        name='light1'
                        intensity={1}
                        direction={Vector3.Up()}
                        // direction={new Vector3(0, 0, 0)}
                        groundColor={Color3.White()}
                        specular={Color3.Black()}
                    />
                    <box
                        isVisible={false}
                        name={SHAPE_NAME}
                        size={SHAPE_SIZE}
                        position={new Vector3(0, 3, 0)}
                        scaling={new Vector3(1, 1, 1)}
                        enableEdgesRendering
                        edgesWidth={5}
                        edgesColor={Color4.FromColor3(Color3.Black(), 1)}
                    >
                        <standardMaterial
                            name={`random-box-mat`}
                            diffuseColor={new Color3(.82, .82, .82)}
                            // specularColor={Color3.White()}
                        />
                    </box>
                </Scene>
            </Engine></>
    );
};

export default Game4;
