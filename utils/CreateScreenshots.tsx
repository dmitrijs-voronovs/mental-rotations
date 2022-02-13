function createScreenshot(
  canvas: HTMLCanvasElement,
  segment: number[],
  segmentWidth: number,
  segmentHeight: number
): string {
  const hiddenCanvas = document.createElement("canvas");
  hiddenCanvas.height = segmentHeight;
  hiddenCanvas.width = segmentWidth;
  hiddenCanvas
    .getContext("2d")!
    .drawImage(
      canvas,
      segmentWidth * segment[0],
      segmentHeight * segment[1],
      segmentWidth,
      segmentHeight,
      0,
      0,
      segmentWidth,
      segmentHeight
    );
  return hiddenCanvas.toDataURL("image/png", 0.9);
}

export function createScreenshots(canvas: HTMLCanvasElement): string[] {
  // TODO: revisit, as width can contain padding;
  const segmentWidth = canvas.width / 5;
  const segmentHeight = canvas.height / 3;
  const segments = [
    [1, 0],
    [3, 0],
    [2, 1],
    [0, 2],
    [1, 2],
    [2, 2],
    [3, 2],
    [4, 2],
  ];

  return segments.map((segment) =>
    createScreenshot(canvas, segment, segmentWidth, segmentHeight)
  );
}
