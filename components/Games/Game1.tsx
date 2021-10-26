import { Color3, Vector3 } from '@babylonjs/core';
import { SpinningBox } from '@components/SpinningBox/SpinningBox';
import React from 'react';
import { BouncingBehavior, Engine, Scene } from 'react-babylonjs';

const Game1 = () => {
	return (
		<div>
			<h2>Game 1</h2>
			<div>
				<Engine
					antialias
					adaptToDeviceRatio
					canvasId='babylonJS'
					width={700}
					height={700}
				>
					<Scene key='scene1'>
						<arcRotateCamera
							name='camera1'
							target={Vector3.Zero()}
							alpha={Math.PI / 2}
							beta={Math.PI / 4}
							radius={8}
						>
							<BouncingBehavior />
						</arcRotateCamera>
						<hemisphericLight
							name='light1'
							intensity={0.7}
							direction={Vector3.Up()}
						/>
						<pointLight
							name='global'
							intensity={0.5}
							position={new Vector3(0, 0, 1)}
						/>
						<SpinningBox
							name='left'
							position={new Vector3(-2, 0, 0)}
							color={Color3.FromHexString('#EEB5EB')}
							hoveredColor={Color3.FromHexString('#C26DBC')}
						/>
						<SpinningBox
							name='right'
							position={new Vector3(2, 0, 0)}
							color={Color3.FromHexString('#C8F4F9')}
							hoveredColor={Color3.FromHexString('#3CACAE')}
						/>
					</Scene>
				</Engine>
			</div>
		</div>
	);
};

export default Game1;
