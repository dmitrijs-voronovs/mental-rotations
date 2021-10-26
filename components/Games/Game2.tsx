import {
	Color3,
	Mesh,
	Scalar,
	Scene as SceneType,
	Vector3,
} from '@babylonjs/core';
import { SpinningBox } from '@components/SpinningBox/SpinningBox';
import React from 'react';
import {
	BouncingBehavior,
	Engine,
	Scene,
	SceneEventArgs,
} from 'react-babylonjs';
import * as dat from 'dat.gui';
import { getRandomInt } from 'utils/common';

type GenerationConfig = {
	spreadOnX: number;
	spreadOnY: number;
	spreadOnZ: number;
	totalBlocks: number;
	deltaForNextBlock: number;
	finalRotationX: number;
	finalRotationY: number;
	finalRotationZ: number;
};

const GENERATION_SETTINGS_KEY = 'Default';
const INITIAL_SETTINGS_KEY = 'initial';

const generateGUI = (sceneEventArgs: SceneEventArgs): dat.GUI => {
	const { scene, canvas } = sceneEventArgs;
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
		deltaForNextBlock: 2,
		deltaForNextBlockMin: 1,
		deltaForNextBlockMax: 3,
		deltaForNextBlockStep: 1,
		finalRotationX: 0,
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
		// functions
		save: () => gui.saveAs(GENERATION_SETTINGS_KEY),
		generateFigure: () => {
			const config = (gui.getSaveObject() as any).remembered[
				GENERATION_SETTINGS_KEY
			][0];
			generateFigure(sceneEventArgs, config);
		},
		clearFigure: () => clearFigure(sceneEventArgs),
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
		'deltaForNextBlock',
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
	['save', 'generateFigure', 'clearFigure'].forEach((fieldName) => {
		gui.add(fieldConfig, fieldName);
	});

	console.log(gui.getRoot(), gui.getSaveObject());

	gui.__controllers.forEach((contr) =>
		contr.onChange((val) => {
			console.log(contr.property, val);
			// if (contr.property !== 'save') gui.saveAs(GENERATION_SETTINGS_KEY);
			console.log(gui.getSaveObject());
		})
	);

	console.log(gui.getSaveObject());

	return gui;
};

const SHAPE_NAME = 'box-figure';
const SHAPE_SIZE = 2;

const generateFigure = (
	sceneEventArgs: SceneEventArgs,
	config: GenerationConfig
) => {
	const { scene } = sceneEventArgs;
	const square = scene.getMeshByName(SHAPE_NAME) as Mesh;
	square.isVisible = false;
	const newCoords = generateCoordinates(config);
	console.log({ newCoords });

	newCoords.forEach((coord, i) => {
		const inst = square.createInstance(`${SHAPE_NAME}-${i}`);
		inst.position = coord;
		console.log(coord);
	});
	console.log(square);
};

const clearFigure = (sceneEventArgs: SceneEventArgs) => {
	const { scene } = sceneEventArgs;
	const square = scene.getMeshByName(SHAPE_NAME) as Mesh;
	square.isVisible = true;
	square.instances.forEach((inst) => inst.dispose());
};

const generateCoordinates = (config: GenerationConfig): Vector3[] => {
	console.log({ config });
	const { totalBlocks } = config;
	const allCoords: Vector3[] = [new Vector3(0, 5, 0)];

	let nBlocksToGenerate = totalBlocks - 1;
	while (nBlocksToGenerate > 0) {
		const randomDeltaVector = getRandomVector(config);
		const newCoord = getNewCoord(allCoords, randomDeltaVector);
		console.log('++++', { randomDeltaVector, newCoord });
		console.log({ newCoord });
		allCoords.push(newCoord);
		nBlocksToGenerate--;
	}
	return allCoords;
};

const getRandomVector = (config: GenerationConfig): Vector3 => {
	const { deltaForNextBlock, spreadOnX, spreadOnY, spreadOnZ } = config;
	const getValueOfRandomVector = (n: number): Vector3 => {
		const absN = Math.abs(n);
		switch (true) {
			case n < spreadOnX:
				return new Vector3(1, 0, 0).scale(n >= 0 ? 1 : -1);
			case n < spreadOnX + spreadOnY:
				return new Vector3(0, 1, 0).scale(n >= 0 ? 1 : -1);
			default:
				return new Vector3(0, 0, 1).scale(n >= 0 ? 1 : -1);
		}
	};

	let vectorsForNextPosition: Vector3[] = [];
	const totalSpread = spreadOnX + spreadOnY + spreadOnZ;
	while (vectorsForNextPosition.length < deltaForNextBlock) {
		const randomN = Scalar.RandomRange(-totalSpread, totalSpread);
		const randomVector = getValueOfRandomVector(randomN);
		vectorsForNextPosition.push(randomVector);
	}

	console.log({ vectorsForNextPosition });

	return vectorsForNextPosition.reduce((resultingVector, vector) =>
		(resultingVector = resultingVector.add(vector)).scale(SHAPE_SIZE)
	);
};

const getNewCoord = (
	existingCoords: Vector3[],
	deltaVector: Vector3
): Vector3 => {
	let noOverlaps = false;
	let newCoord: Vector3 = Vector3.Zero();
	while (!noOverlaps) {
		const randomExistingCordIdx = getRandomInt(existingCoords.length);
		console.log('___getting new coord ___', {
			deltaVector,
			randomExistingCordIdx,
			len: existingCoords.length,
			existingCoords,
		});
		newCoord = existingCoords[randomExistingCordIdx].add(deltaVector);
		// TODO: add check for no overlaps
		// noOverlaps = existingCoords.every(
		// 	(existingCoord) => existingCoord.toString() !== newCoord.toString()
		// );
		noOverlaps = true;
	}
	return newCoord;
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
					width={1000}
					height={1000}
					debug
				>
					<Scene
						key='scene2'
						onSceneMount={onSceneMount}
						onDispose={() => console.log('disposing')}
					>
						<arcRotateCamera
							name='camera1'
							target={Vector3.Zero()}
							alpha={Math.PI / 2}
							beta={Math.PI / 4}
							radius={20}
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
							name={SHAPE_NAME}
							size={SHAPE_SIZE}
							position={new Vector3(0, 3, 0)}
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
