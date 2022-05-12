import { SceneEventArgs } from "react-babylonjs";
import { createScreenshots } from "./CreateScreenshots";
import { Tools } from "@babylonjs/core";
import { dispatchProjectEvent } from "./Events";

function downloadScreenshot(name: string, base64: string) {
  const a = document.createElement("a");
  a.download = name;
  a.href = base64;
  a.click();
}

export function getScreenName(taskN: number, i?: number) {
  return i === undefined ? `task-${taskN}.png` : `task-${taskN}_${i}.png`;
}

function downloadScreenshots(base64: string[], taskN: number) {
  base64.forEach((screen, i) => {
    downloadScreenshot(getScreenName(taskN, i + 1), screen);
  });
}

export function saveScreenshots(sceneEventArgs: SceneEventArgs) {
  console.log("meta", sceneEventArgs.scene.metadata);
  const screenshots = createScreenshots(sceneEventArgs.canvas);
  downloadScreenshots(screenshots, sceneEventArgs.scene.metadata);

  const fullScreenshotName = getScreenName(sceneEventArgs.scene.metadata);
  Tools.CreateScreenshotAsync(
    sceneEventArgs.scene.getEngine(),
    sceneEventArgs.scene.activeCameras![0],
    { precision: 3 }
  ).then((base64) => {
    downloadScreenshot(fullScreenshotName, base64);
  });

  dispatchProjectEvent("sceneCreated", {
    referenceShape: getScreenName(sceneEventArgs.scene.metadata, 1),
    referenceShapeRotated: getScreenName(sceneEventArgs.scene.metadata, 2),
    testShape: getScreenName(sceneEventArgs.scene.metadata, 3),
    testShape1: getScreenName(sceneEventArgs.scene.metadata, 4),
    testShape2: getScreenName(sceneEventArgs.scene.metadata, 5),
    testShape3: getScreenName(sceneEventArgs.scene.metadata, 6),
    testShape4: getScreenName(sceneEventArgs.scene.metadata, 7),
    testShape5: getScreenName(sceneEventArgs.scene.metadata, 8),
    scene: getScreenName(sceneEventArgs.scene.metadata),
  });
}
