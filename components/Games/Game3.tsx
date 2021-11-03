import {
	Camera,
	Color3,
	Color4,
	Mesh,
	Scalar,
	Scene as SceneType,
	TransformNode,
	Vector3,
} from '@babylonjs/core';
import * as dat from 'dat.gui';
import React, { useRef } from 'react';
import { Engine, Scene, SceneEventArgs, useScene } from 'react-babylonjs';
import { getRandomInt } from 'utils/common';
import { isMobile } from 'react-device-detect';
import { createAxis, deleteAxis } from '@components/Axis/axisHelper';
import { Container } from '@components/common/Container';

type GenerationConfig = {
	spreadOnX: number;
	spreadOnY: number;
	spreadOnZ: number;
	totalBlocks: number;
	maxDeltaForNextBlock: number;
	finalRotationX: number;
	finalRotationY: number;
	finalRotationZ: number;
	showAxis: boolean;
};

const AXIS_SIZE = 5;
const GENERATION_SETTINGS_KEY = 'Default';
const INITIAL_SETTINGS_KEY = 'initial';

const generateGUI = (sceneEventArgs: SceneEventArgs): dat.GUI => {
	const { canvas } = sceneEventArgs;
	const gui = new dat.GUI({ name: 'My GUI' });

	// GUI placement
	gui.domElement.id = 'datGUI';
	gui.useLocalStorage = true;
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
		maxDeltaForNextBlock: 2,
		maxDeltaForNextBlockMin: 1,
		maxDeltaForNextBlockMax: 3,
		maxDeltaForNextBlockStep: 1,
		finalRotationX: 110,
		finalRotationXMin: 0,
		finalRotationXMax: 360,
		finalRotationXStep: 1,
		finalRotationY: 0,
		finalRotationYMin: 0,
		finalRotationYMax: 360,
		finalRotationYStep: 1,
		finalRotationZ: 0,
		finalRotationZMin: 0,
		finalRotationZMax: 360,
		finalRotationZStep: 1,
		// boolean
		showAxis: true,
		// functions
		save: () => gui.saveAs(GENERATION_SETTINGS_KEY),
		generateFigure() {
			this.save();
			const config = (gui.getSaveObject() as any).remembered[
				GENERATION_SETTINGS_KEY
			][0];
			generateFigure(sceneEventArgs, config);
			if (config.showAxis) {
				createAxis(sceneEventArgs, AXIS_SIZE);
			} else {
				deleteAxis(sceneEventArgs);
			}
		},
		clearFigure: () => clearFigure(sceneEventArgs),
		clearAndGenerate() {
			this.clearFigure();
			this.generateFigure();
		},
	};

	gui.remember(fieldConfig);
	gui.saveAs(INITIAL_SETTINGS_KEY);

	['spreadOnX', 'spreadOnY', 'spreadOnZ'].forEach((fieldName) => {
		gui.add(
			fieldConfig,
			fieldName,
			fieldConfig.spreadMin,
			fieldConfig.spreadMax,
			fieldConfig.spreadStep
		);
	});
	[
		'totalBlocks',
		'finalRotationX',
		'finalRotationY',
		'finalRotationZ',
		'maxDeltaForNextBlock',
	].forEach((fieldName) => {
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
	[
		'showAxis',
		'save',
		'generateFigure',
		'clearFigure',
		'clearAndGenerate',
	].forEach((fieldName) => {
		gui.add(fieldConfig, fieldName);
	});

	return gui;
};

const SHAPE_NAME = 'box-figure';
const SHAPE_SIZE = 2;
const SHAPE_INITIAL_COORD = new Vector3(0, -2, 0);
const CLONE_SHAPE_NAME = 'box-figure-2';
const SHAPE_PARENT_NAME = 'figure_parent';

const generateFigure = (
	sceneEventArgs: SceneEventArgs,
	config: GenerationConfig
) => {
	const { scene } = sceneEventArgs;
	const square = scene.getMeshByName(SHAPE_NAME) as Mesh;
	const newCoords = generateCoordinates(config);
	const rotation = generateRotation(config);

	newCoords.forEach((coord, i) => {
		const inst = square.createInstance(`${SHAPE_NAME}-${i}`);
		inst.setParent(square);
		inst.scalingDeterminant = 0.99;
		inst.position = coord;
	});
	square.edgesShareWithInstances = true;
	square.rotation = rotation;

	const parent =
		scene.getTransformNodeByName(SHAPE_PARENT_NAME) ||
		new TransformNode(SHAPE_PARENT_NAME);
	const square2 = square.clone(CLONE_SHAPE_NAME, parent, false, true);
	square2.position.x = 12;
	square2.rotate(
		new Vector3(Math.random() * 360, Math.random() * 360, Math.random() * 360),
		1
	);
	square.setParent(parent);
	parent.position.x = -6;
};

const clearFigure = (sceneEventArgs: SceneEventArgs) => {
	const { scene } = sceneEventArgs;
	const square = scene.getMeshByName(SHAPE_NAME) as Mesh;
	while (square.instances.length) {
		square.instances.forEach((inst) => {
			inst.dispose();
		});
	}
	square.rotation = Vector3.Zero();
	const square2 = scene.getMeshByName(CLONE_SHAPE_NAME) as Mesh;
	square2?.dispose();
};

const generateRotation = (config: GenerationConfig): Vector3 => {
	return new Vector3(
		config.finalRotationX,
		config.finalRotationY,
		config.finalRotationZ
	).scale(SHAPE_SIZE);
};

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
				alpha={(5 * Math.PI) / 8}
				beta={(5 * Math.PI) / 8}
				radius={50}
				target={new Vector3(0, 0, 0)}
				onCreated={alwaysActive}
			>
				<viewport x={0} y={0} height={0.5} width={1} />
			</arcRotateCamera>

			<arcRotateCamera
				name='camera2'
				alpha={(3 * Math.PI) / 8}
				beta={(3 * Math.PI) / 8}
				radius={30}
				target={new Vector3(0, 0, 0)}
				onCreated={alwaysActive}
			>
				<viewport x={0} y={0.5} height={0.5} width={1} />
			</arcRotateCamera>
		</>
	);
};

const Game2 = () => {
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
			<h2>Stage 3 - Created basic Game UI</h2>
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
								diffuseColor={Color3.Gray()}
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

export default Game2;