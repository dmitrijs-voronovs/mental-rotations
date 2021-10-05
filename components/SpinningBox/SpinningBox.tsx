import React, { MutableRefObject, useRef, useState } from 'react';
import { Engine, useBeforeRender, useClick, useHover } from 'react-babylonjs';
import {
	Vector3,
	Color3,
	Mesh,
	Nullable,
	Axis,
	Scene,
	PointerDragBehavior,
} from '@babylonjs/core';
import { Control } from '@babylonjs/gui';

const DefaultScale = new Vector3(1, 1, 1);
const BiggerScale = new Vector3(1.25, 1.25, 1.25);

export const SpinningBox = (props: any) => {
	// access Babylon scene objects with same React hook as regular DOM elements
	const boxRef = useRef<Nullable<Mesh>>(null);

	const [clicked, setClicked] = useState(false);
	useClick(() => setClicked((clicked) => !clicked), boxRef);

	const [hovered, setHovered] = useState(false);
	useHover(
		() => setHovered(true),
		() => setHovered(false),
		boxRef
	);

	// This will rotate the box on every Babylon frame.
	const rpm = 5;
	useBeforeRender((scene) => {
		if (boxRef.current) {
			// Delta time smoothes the animation.
			var deltaTimeInMillis = scene.getEngine().getDeltaTime();
			boxRef.current.rotation.y +=
				(rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
		}
	});

	console.log(boxRef.current, 'hereh');

	return (
		<box
			name={props.name}
			onCreated={(instance: Mesh, scene: Scene) => {
				var pointerDragBehavior = new PointerDragBehavior({
					dragAxis: new Vector3(0, 1, 0),
				});

				pointerDragBehavior.useObjectOrientationForDragging = false;

				// Listen to drag events
				pointerDragBehavior.onDragStartObservable.add((event) => {
					console.log('dragStart');
					console.log(event);
				});
				pointerDragBehavior.onDragObservable.add((event) => {
					console.log('drag');
					console.log(event);
				});
				pointerDragBehavior.onDragEndObservable.add((event) => {
					console.log('dragEnd');
					console.log(event);
				});
				instance.addBehavior(pointerDragBehavior);

				const in1 = instance.createInstance(instance.name + 'ins2');
				in1.rotate(
					new Vector3(1, 2, 0),
					1 * (instance.name === 'left' ? 2 : 1)
				);
				in1.position.addInPlaceFromFloats(1, 2, 3);
				instance.isVisible = true;
			}}
			ref={boxRef}
			size={2}
			position={props.position}
			scaling={clicked ? BiggerScale : DefaultScale}
		>
			<standardMaterial
				name={`${props.name}-mat`}
				diffuseColor={hovered ? props.hoveredColor : props.color}
				specularColor={Color3.Black()}
			/>
		</box>
	);
};
