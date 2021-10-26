import { Color3, Mesh, Scalar, Vector3 } from '@babylonjs/core';
import * as dat from 'dat.gui';
import React from 'react';
import { Engine, Scene, SceneEventArgs } from 'react-babylonjs';
import { getRandomInt } from 'utils/common';

type GenerationConfig = {
	spreadOnX: number;
	spreadOnY: number;
	spreadOnZ: number;
	totalBlocks: number;
	maxDeltaForNextBlock: number;
	finalRotationX: number;
	finalRotationY: number;
	finalRotationZ: number;
};

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
		// functions
		save: () => gui.saveAs(GENERATION_SETTINGS_KEY),
		generateFigure() {
			this.save();
			const config = (gui.getSaveObject() as any).remembered[
				GENERATION_SETTINGS_KEY
			][0];
			generateFigure(sceneEventArgs, config);
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
	['save', 'generateFigure', 'clearFigure', 'clearAndGenerate'].forEach(
		(fieldName) => {
			gui.add(fieldConfig, fieldName);
		}
	);

	gui.__controllers.forEach((contr) => contr.onChange((val) => {}));

	return gui;
};

const SHAPE_NAME = 'box-figure';
const SHAPE_SIZE = 2;
const SHAPE_INITIAL_COORD = new Vector3(0, 0, 0);

const generateFigure = (
	sceneEventArgs: SceneEventArgs,
	config: GenerationConfig
) => {
	const { scene } = sceneEventArgs;
	const square = scene.getMeshByName(SHAPE_NAME) as Mesh;
	square.isVisible = false;
	const newCoords = generateCoordinates(config);
	const rotation = generateRotation(config);

	newCoords.forEach((coord, i) => {
		const inst = square.createInstance(`${SHAPE_NAME}-${i}`);
		inst.setParent(square);
		inst.position = coord;
	});
	square.rotation = rotation;
};

const clearFigure = (sceneEventArgs: SceneEventArgs) => {
	const { scene } = sceneEventArgs;
	const square = scene.getMeshByName(SHAPE_NAME) as Mesh;
	square.isVisible = true;
	while (square.instances.length) {
		square.instances.forEach((inst) => {
			inst.dispose();
		});
	}
	square.rotation = Vector3.Zero();
};

const generateRotation = (config: GenerationConfig): Vector3 => {
	return new Vector3(
		config.finalRotationX,
		config.finalRotationY,
		config.finalRotationZ
	).scale(SHAPE_SIZE);
};

const generateCoordinates = (config: GenerationConfig): Vector3[] => {
	const { totalBlocks, finalRotationX, finalRotationY, finalRotationZ } =
		config;
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
		// TODO: add check for no overlaps
		isOverlapping = existingCoords.some(
			(existingCoord) => existingCoord.toString() === newCoord.toString()
		);
		// noOverlaps = true;
	}
	if (isOverlapping) console.warn('can not add new COORD');
	return !isOverlapping ? newCoord : null;
};

const Game2 = () => {
	const onSceneMount = (sceneEventArgs: SceneEventArgs) => {
		const { canvas, scene } = sceneEventArgs;
		const gui = generateGUI(sceneEventArgs);
		scene.onDisposeObservable.add(() => gui.destroy());
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
					<Scene key='scene2' onSceneMount={onSceneMount}>
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
						<box
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
						</ground>
					</Scene>
				</Engine>
			</div>
		</div>
	);
};

export default Game2;
