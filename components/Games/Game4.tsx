import {Camera, Color3, Color4, Vector3,} from '@babylonjs/core';
import React from 'react';
import {Engine, Scene, SceneEventArgs, useScene} from 'react-babylonjs';
import {isMobile} from 'react-device-detect';
import {createAxis} from '@components/Axis/axisHelper';
import {Container} from '@components/common/Container';
import {AXIS_SIZE, generateGUI} from "../../utils/GenerateGUI";
import {SHAPE_NAME, SHAPE_SIZE} from "../../utils/GenerateFigure";

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
				// alpha={(5 * Math.PI) / 8}
				// beta={(5 * Math.PI) / 8}
				alpha={0}
				beta={360}
				radius={50}
				target={new Vector3(0, 0, 0)}
				onCreated={alwaysActive}
			>
				<viewport x={0} y={0.5} height={0.5} width={1} />
			</arcRotateCamera>

			<arcRotateCamera
				name='camera2'
				alpha={(3 * Math.PI) / 8}
				beta={(3 * Math.PI) / 8}
				radius={30}
				target={new Vector3(0, 0, 0)}
				onCreated={alwaysActive}
			>
				<viewport x={0} y={0} height={0.5} width={1} />
			</arcRotateCamera>
		</>
	);
};

const Game4 = () => {
	const onSceneMount = (sceneEventArgs: SceneEventArgs) => {
		const { scene } = sceneEventArgs;
		const gui = generateGUI(sceneEventArgs);
		createAxis(sceneEventArgs, AXIS_SIZE);
		scene.onDisposeObservable.add(() => gui.destroy());
	};

	// const scene = useScene();
	// scene?.debugLayer.show();

	const size = isMobile ? 300 : 1000;

	return (
		<Container>
			<h2>Stage 4 - Created basic Game UI</h2>
			<div>
				<Engine
					antialias
					adaptToDeviceRatio
					canvasId='babylonJS'
					width={size}
					height={size}
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
						{/* <arcRotateCamera
							name='camera1'
							target={Vector3.Zero()}
							alpha={Math.PI / 3}
							beta={Math.PI / 3}
							radius={20}
						></arcRotateCamera> */}
						<Cameras />
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
								diffuseColor={Color3.Blue()}
								// specularColor={Color3.White()}
							/>
						</box>
						{/* <ground
							name='ground'
							height={10}
							width={10}
							position={new Vector3(0, -5, 0)}
						>
							<standardMaterial
								name={`random-box-mat`}
								diffuseColor={Color3.Black()}
								specularColor={Color3.Black()}
							/>
						</ground> */}
					</Scene>
				</Engine>
			</div>
		</Container>
	);
};

export default Game4;
