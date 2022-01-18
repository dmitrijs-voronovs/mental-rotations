import {SceneEventArgs} from 'react-babylonjs'
import {createAxis, deleteAxis} from '@components/Axis/axisHelper'
import {clearFigure, generateFigure, GenerationConfig} from './GenerateFigure'
import {GUI} from 'dat.gui'

export type GuiConfigDefinition = GenerationConfig & {
    clearAndGenerate(): void
    save: () => void
    generateFigure(): void
    clearFigure: () => void
    spreadMin: number;
    spreadMax: number;
    spreadStep: number;
    totalBlocksMax: number;
    totalBlocksMin: number;
    totalBlocksStep: number;
    maxDeltaForNextBlockMin: number;
    maxDeltaForNextBlockMax: number;
    maxDeltaForNextBlockStep: number;
    finalRotationXMin: number;
    finalRotationXMax: number;
    finalRotationXStep: number;
    finalRotationYMin: number;
    finalRotationYMax: number;
    finalRotationYStep: number;
    finalRotationZMin: number;
    finalRotationZMax: number;
    finalRotationZStep: number;
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

export const defaultGuiConfig = {
    spreadMin: 0,
    spreadMax: 1,
    spreadStep: 0.01,
    totalBlocksMax: 20,
    totalBlocksMin: 2,
    totalBlocksStep: 1,
    maxDeltaForNextBlockMin: 1,
    maxDeltaForNextBlockMax: 3,
    maxDeltaForNextBlockStep: 1,
    finalRotationXMin: 0,
    finalRotationXMax: 360,
    finalRotationXStep: 1,
    finalRotationYMin: 0,
    finalRotationYMax: 360,
    finalRotationYStep: 1,
    finalRotationZMin: 0,
    finalRotationZMax: 360,
    finalRotationZStep: 1,
}

export const defaultConfig = {
    spreadOnX: 0.5,
    spreadOnY: 0.5,
    spreadOnZ: 0.5,
    totalBlocks: 8,
    maxDeltaForNextBlock: 1,
    finalRotationX: 0,
    finalRotationY: 0,
    finalRotationZ: 0,
    originX: 0,
    originY: 0,
    originZ: 0,
    showAxis: true,
}

function populateGui(gui: GUI, fieldConfig: GuiConfigDefinition) {
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

declare global {
    interface Window {
        me: string;
    }
}

export const generateGUI = (sceneEventArgs: SceneEventArgs): GUI => {
    const {canvas} = sceneEventArgs

    window.me = "123124";
    const gui = new GUI({name: 'My GUI'})

    placeGui(gui, canvas)
    // GUI values
    const fieldConfig = {
        ...defaultGuiConfig,
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
