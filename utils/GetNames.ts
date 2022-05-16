export function getTransformNodeName(shapeName: string) {
  return `transform-${shapeName}`;
}

export function getInstanceName(shapeName: string, i: number) {
  return `${shapeName}-inst-${i}`;
}

export function getBoxName(i: number) {
  return `box-${i}`;
}

export function getCameraName(i: number) {
  return `camera-${i}`;
}
