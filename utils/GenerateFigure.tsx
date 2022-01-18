import {Mesh, Scalar, TransformNode, Vector3} from '@babylonjs/core'
import {SceneEventArgs} from 'react-babylonjs'
import {getRandomInt} from './common'

export const SHAPE_NAME = 'box-figure'
export const SHAPE_SIZE = 2
const SHAPE_INITIAL_COORD = new Vector3(0, -2, 0)

const SHAPE_PARENT_NAME = 'figure_parent'

export type GenerationConfig = {
  spreadOnX: number
  spreadOnY: number
  spreadOnZ: number
  totalBlocks: number
  maxDeltaForNextBlock: number
  finalRotationX: number
  finalRotationY: number
  finalRotationZ: number
  originX: number,
  originY: number,
  originZ: number,
  showAxis: boolean,
}

export const generateFigure = (
  sceneEventArgs: SceneEventArgs,
  config: GenerationConfig,
  shapeName = SHAPE_NAME
) => {
  const { scene } = sceneEventArgs
  const square = scene.getMeshByName(shapeName) as Mesh
  const newCoords = generateCoordinates(config)
  const rotation = generateRotation(config)

  newCoords.forEach((coord, i) => {
    const inst = square.createInstance(`${shapeName}-${i}`)
    inst.setParent(square)
    inst.scalingDeterminant = 0.99
    inst.position = coord
  })

  square.edgesShareWithInstances = true
  square.rotation = rotation
  square.position = new Vector3(config.originX, config.originY, config.originZ);

  const parent =
    scene.getTransformNodeByName(SHAPE_PARENT_NAME) ||
    new TransformNode(SHAPE_PARENT_NAME)
  square.setParent(parent)
  // parent.position.x = -6
}

export const clearFigure = (sceneEventArgs: SceneEventArgs, shapeName = SHAPE_NAME) => {
  const { scene } = sceneEventArgs
  const square = scene.getMeshByName(shapeName) as Mesh
  while (square.instances.length) {
    square.instances.forEach((inst) => {
      inst.dispose()
    })
  }
  square.rotation = Vector3.Zero()
}

const generateRotation = (config: GenerationConfig): Vector3 =>
    new Vector3(
        config.finalRotationX,
        config.finalRotationY,
        config.finalRotationZ
    ).scale(SHAPE_SIZE)

const generateCoordinates = (config: GenerationConfig): Vector3[] => {
  const { totalBlocks } = config
  const allCoords: Vector3[] = [SHAPE_INITIAL_COORD]

  let nBlocksToGenerate = totalBlocks - 1
  while (nBlocksToGenerate > 0) {
    const randomDeltaVector = getRandomVector(config)
    const newCoord = getNewCoord(allCoords, randomDeltaVector)
    if (newCoord) {
      allCoords.push(newCoord)
      nBlocksToGenerate--
    }
  }
  return allCoords
}

const getRandomVector = (config: GenerationConfig): Vector3 => {
  const { maxDeltaForNextBlock, spreadOnX, spreadOnY, spreadOnZ } = config
  const getValueOfRandomVector = (n: number): Vector3 => {
    const absN = Math.abs(n)
    switch (true) {
      case absN < spreadOnX:
        return new Vector3(1, 0, 0).scale(n >= 0 ? 1 : -1)
      case absN < spreadOnX + spreadOnY:
        return new Vector3(0, 1, 0).scale(n >= 0 ? 1 : -1)
      default:
        return new Vector3(0, 0, 1).scale(n >= 0 ? 1 : -1)
    }
  }

  let vectorsForNextPosition: Vector3[] = []
  const deltaForNextBlock = getRandomInt(maxDeltaForNextBlock) + 1
  const totalSpread = spreadOnX + spreadOnY + spreadOnZ
  while (vectorsForNextPosition.length < deltaForNextBlock) {
    const randomN = Scalar.RandomRange(-totalSpread, totalSpread)
    const randomVector = getValueOfRandomVector(randomN)
    vectorsForNextPosition.push(randomVector)
  }

  return vectorsForNextPosition
    .reduce(
      (resultingVector, vector) =>
        (resultingVector = resultingVector.add(vector))
    )
    .scale(SHAPE_SIZE)
}

const getNewCoord = (
  existingCoords: Vector3[],
  deltaVector: Vector3
): Vector3 | null => {
  const usedCoords: number[] = []
  let isOverlapping = true
  let newCoord: Vector3 = Vector3.Zero()
  while (isOverlapping && usedCoords.length < existingCoords.length) {
    const randomExistingCordIdx = getRandomInt(existingCoords.length)
    // TODO: improve not to restart, but to find closest non-used value
    if (usedCoords.includes(randomExistingCordIdx)) {
      continue
    } else {
      usedCoords.push(randomExistingCordIdx)
    }

    newCoord = existingCoords[randomExistingCordIdx].add(deltaVector)
    isOverlapping = existingCoords.some(
      (existingCoord) => existingCoord.toString() === newCoord.toString()
    )
  }
  return !isOverlapping ? newCoord : null
}
