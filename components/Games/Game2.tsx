import { Color3, Scene as SceneType, Vector3 } from '@babylonjs/core';
import { SpinningBox } from '@components/SpinningBox/SpinningBox';
import React from 'react';
import {
	BouncingBehavior,
	Engine,
	Scene,
	SceneEventArgs,
} from 'react-babylonjs';
import * as dat from 'dat.gui';

const generateGUI = (sceneEventArgs: SceneEventArgs): dat.GUI => {
	const { scene, canvas } = sceneEventArgs;
	const gui = new dat.GUI({ name: 'My GUI' });

	// GUI placement
	gui.domElement.id = 'datGUI';
	const canvasPlacement = canvas.getBoundingClientRect();
	gui.domElement.style.marginTop = `${canvasPlacement.top + 30}px`;
	gui.domElement.style.marginRight = `${canvasPlacement.left + 30}px`;

	// GUI values
	const fieldConfig = {
		spreadOnX: 0.5,
		spreadOnY: 0.5,
		spreadOnZ: 0.5,
		spreadMin: 0,
		spreadMax: 1,
		spreadStep: 0.01,
		totalBlocks: 5,
		totalBlocksMax: 20,
		totalBlocksMin: 2,
		totalBlocksStep: 1,
		deltaForNextBlock: 2,
		deltaForNextBlockMin: 1,
		deltaForNextBlockMax: 3,
		deltaForNextBlockStep: 1,
		finalRotation: 0,
		finalRotationMin: 0,
		finalRotationMax: 360,
		finalRotationStep: 1,
	};
	['spreadOnX', 'spreadOnY', 'spreadOnZ'].forEach((fieldName) => {
		gui.add(
			fieldConfig,
			fieldName,
			fieldConfig.spreadMin,
			fieldConfig.spreadMax,
			fieldConfig.spreadStep
		);
	});
	['totalBlocks', 'deltaForNextBlock', 'finalRotation'].forEach((fieldName) => {
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
	gui.__controllers.forEach((contr) =>
		contr.onChange((val) => console.log(contr.property, val))
	);

	console.log(gui.getSaveObject());

	return gui;
};

const Game2 = () => {
	const onSceneMount = (sceneEventArgs: SceneEventArgs) => {
		const { canvas, scene } = sceneEventArgs;
		const gui = generateGUI(sceneEventArgs);
	};

	return (
		<div>
			<h2>Game 2</h2>
			<div>
				<Engine
					antialias
					adaptToDeviceRatio
					canvasId='babylonJS'
					width={700}
					height={700}
					debug
				>
					<Scene onSceneMount={onSceneMount}>
						<arcRotateCamera
							name='camera1'
							target={Vector3.Zero()}
							alpha={Math.PI / 2}
							beta={Math.PI / 4}
							radius={8}
						></arcRotateCamera>
						<hemisphericLight
							name='light1'
							intensity={0.7}
							direction={Vector3.Up()}
						/>
						<pointLight
							name='global'
							intensity={0.5}
							position={new Vector3(0, 0, 0)}
						/>
						<box
							name={'random box'}
							size={2}
							position={new Vector3(0, 1, 0)}
							scaling={new Vector3(1, 1, 1)}
						>
							<standardMaterial
								name={`random-box-mat`}
								diffuseColor={Color3.Red()}
								specularColor={Color3.Black()}
							/>
						</box>
						<ground name='ground' scaling={new Vector3(10, 1, 10)} />
					</Scene>
				</Engine>
			</div>
		</div>
	);
};

export default Game2;
