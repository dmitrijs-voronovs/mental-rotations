import {SceneEventArgs} from 'react-babylonjs'
import {createAxis, deleteAxis} from '@components/Axis/axisHelper'
import {clearFigure, generateFigure} from './GenerateFigure'
import {GUI} from 'dat.gui'

export type GenerationConfig = {
    spreadOnX: number
    spreadOnY: number
    spreadOnZ: number
    totalBlocks: number
    maxDeltaForNextBlock: number
    finalRotationX: number
    finalRotationY: number
    finalRotationZ: number
    showAxis: boolean
}

export type GenerationConfigDefinition = {
    spreadOnX: number
    spreadOnY: number
    finalRotationZMax: number
    clearAndGenerate(): void
    save: () => void
    finalRotationZ: number
    finalRotationY: number
    finalRotationX: number
    spreadOnZ: number
    finalRotationZStep: number
    generateFigure(): void
    finalRotationZMin: number
    spreadMax: number
    finalRotationXMin: number
    totalBlocksStep: number
    totalBlocks: number
    maxDeltaForNextBlockStep: number
    clearFigure: () => void
    finalRotationYStep: number
    spreadStep: number
    finalRotationYMax: number
    maxDeltaForNextBlockMin: number
    totalBlocksMax: number
    maxDeltaForNextBlock: number
    finalRotationYMin: number
    finalRotationXMax: number
    finalRotationXStep: number
    spreadMin: number
    totalBlocksMin: number
    maxDeltaForNextBlockMax: number
    showAxis: boolean
}

export const AXIS_SIZE = 5

const GENERATION_SETTINGS_KEY = 'Default'
const INITIAL_SETTINGS_KEY = 'initial'

function placeGui(gui: GUI, canvas: HTMLCanvasElement) {
    // GUI placement
    gui.domElement.id = 'datGUI'
    gui.useLocalStorage = true
    const canvasPlacement = canvas.getBoundingClientRect()
    gui.domElement.style.marginTop = `${canvasPlacement.top + 30}px`
    gui.domElement.style.marginRight = `${canvasPlacement.left + 30}px`
}

export const defaultConfig = {
    spreadOnX: 0.5,
    spreadOnY: 0.5,
    spreadOnZ: 0.5,
    spreadMin: 0,
    spreadMax: 1,
    spreadStep: 0.01,
    totalBlocks: 8,
    totalBlocksMax: 20,
    totalBlocksMin: 2,
    totalBlocksStep: 1,
    maxDeltaForNextBlock: 1,
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
}

function populateGui(gui: GUI, fieldConfig: GenerationConfigDefinition) {
    ;['spreadOnX', 'spreadOnY', 'spreadOnZ'].forEach((fieldName) => {
        gui.add(
            fieldConfig,
            fieldName,
            fieldConfig.spreadMin,
            fieldConfig.spreadMax,
            fieldConfig.spreadStep
        )
    })
    ;[
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
        )
    })
    ;[
        'showAxis',
        'save',
        'generateFigure',
        'clearFigure',
        'clearAndGenerate',
    ].forEach((fieldName) => {
        gui.add(fieldConfig, fieldName)
    })
}

export const generateGUI = (sceneEventArgs: SceneEventArgs): GUI => {
    const {canvas} = sceneEventArgs

    const gui = new GUI({name: 'My GUI'})

    placeGui(gui, canvas)
    // GUI values
    const fieldConfig = {
        ...defaultConfig,
        // functions
        save: () => gui.saveAs(GENERATION_SETTINGS_KEY),
        generateFigure() {
            this.save()
            const config = (gui.getSaveObject() as any).remembered[
                GENERATION_SETTINGS_KEY
                ][0]
            generateFigure(sceneEventArgs, config)
            if (config.showAxis) {
                createAxis(sceneEventArgs, AXIS_SIZE)
            } else {
                deleteAxis(sceneEventArgs)
            }
        },
        clearFigure: () => clearFigure(sceneEventArgs),
        clearAndGenerate() {
            this.clearFigure()
            this.generateFigure()
        },
    }

    gui.remember(fieldConfig)
    gui.saveAs(INITIAL_SETTINGS_KEY)

    populateGui(gui, fieldConfig)

    return gui
}
