import {
	Color3,
	DynamicTexture,
	Mesh,
	StandardMaterial,
	Vector3,
} from '@babylonjs/core';
import { SceneEventArgs } from 'react-babylonjs';

export const createAxis = (sceneEventArgs: SceneEventArgs, size: number) => {
	const { scene } = sceneEventArgs;
	const areAxisDrawn = scene.meshes.some((mesh) =>
		mesh.name.toLowerCase().includes('axis')
	);
	if (areAxisDrawn) return;

	const makeTextPlane = function (text: string, color: string, size: number) {
		const dynamicTexture = new DynamicTexture(
			'DynamicTexture',
			50,
			scene,
			true
		);
		dynamicTexture.hasAlpha = true;
		dynamicTexture.drawText(
			text,
			5,
			40,
			'bold 36px Arial',
			color,
			'transparent',
			true
		);
		const plane = Mesh.CreatePlane('Axis-TextPlane', size, scene, true);
		plane.material = new StandardMaterial('TextPlaneMaterial', scene);
		plane.material.backFaceCulling = false;
		// @ts-ignore
		plane.material.specularColor = new Color3(0, 0, 0);
		// @ts-ignore
		plane.material.diffuseTexture = dynamicTexture;
		return plane;
	};

	const axisX = Mesh.CreateLines(
		'axisX',
		[
			Vector3.Zero(),
			new Vector3(size, 0, 0),
			new Vector3(size * 0.95, 0.05 * size, 0),
			new Vector3(size, 0, 0),
			new Vector3(size * 0.95, -0.05 * size, 0),
		],
		scene
	);
	axisX.color = new Color3(1, 0, 0);
	const xChar = makeTextPlane('X', 'red', size / 10);
	xChar.position = new Vector3(0.9 * size, -0.05 * size, 0);
	const axisY = Mesh.CreateLines(
		'axisY',
		[
			Vector3.Zero(),
			new Vector3(0, size, 0),
			new Vector3(-0.05 * size, size * 0.95, 0),
			new Vector3(0, size, 0),
			new Vector3(0.05 * size, size * 0.95, 0),
		],
		scene
	);
	axisY.color = new Color3(0, 1, 0);
	const yChar = makeTextPlane('Y', 'green', size / 10);
	yChar.position = new Vector3(0, 0.9 * size, -0.05 * size);
	const axisZ = Mesh.CreateLines(
		'axisZ',
		[
			Vector3.Zero(),
			new Vector3(0, 0, size),
			new Vector3(0, -0.05 * size, size * 0.95),
			new Vector3(0, 0, size),
			new Vector3(0, 0.05 * size, size * 0.95),
		],
		scene
	);
	axisZ.color = new Color3(0, 0, 1);
	const zChar = makeTextPlane('Z', 'blue', size / 10);
	zChar.position = new Vector3(0, 0.05 * size, 0.9 * size);
};

export const deleteAxis = (sceneEventArgs: SceneEventArgs) => {
	const { scene } = sceneEventArgs;
	scene.meshes.forEach((mesh) => {
		if (mesh.name.toLowerCase().includes('axis')) {
			mesh.dispose();
		}
	});
};
