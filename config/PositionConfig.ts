import { ArcRotateCamera, Vector3, Viewport } from "@babylonjs/core";

export type PositionConfigEntity = Partial<ArcRotateCamera> & Partial<Viewport>;
export const defaultPositionConfig: PositionConfigEntity = {
  name: "camera-r",
  alpha: Math.PI * 0.25,
  beta: Math.PI * 0.3,
  radius: 25,
  target: new Vector3(0, 0, 0),
  height: 0.33,
  width: 0.2,
};
export const positionConfig: PositionConfigEntity[] = [
  { x: 0.2, y: 0.66, height: 0.33, width: 0.2 },
  { x: 0.6, y: 0.66, height: 0.33, width: 0.2 },
  { x: 0.4, y: 0.33, height: 0.33, width: 0.2 },
  { x: 0, y: 0, height: 0.33, width: 0.2 },
  { x: 0.2, y: 0, height: 0.33, width: 0.2 },
  { x: 0.4, y: 0, height: 0.33, width: 0.2 },
  { x: 0.6, y: 0, height: 0.33, width: 0.2 },
  { x: 0.8, y: 0, height: 0.33, width: 0.2 },
];
export const POSITION_MULTIPLIER = 2000;
