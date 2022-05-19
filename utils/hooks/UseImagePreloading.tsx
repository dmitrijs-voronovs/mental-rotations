import { useEffect, useState } from "react";
import { TestScreenshots } from "@components/EventDisplay";
import { TestDetailsProps } from "../../pages/tests/[id]";

type UseImagePreloadingProps = TestDetailsProps;
type UseImagePreloadingReturn = {
  total: number;
  progress: number;
};
const IMAGE_OF_ENTIRE_SCENE = 1;

export function useImagePreloading({
  test,
}: UseImagePreloadingProps): UseImagePreloadingReturn {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function loadTaskImages(imgNames: TestScreenshots) {
      Object.entries(imgNames).forEach(([name, src]) => {
        if (name === "scene") return;
        const img = new Image();
        img.src = src;
        img.onload = (_e) => {
          setProgress((old) => old + 1);
        };
      });
    }

    if (test) {
      test.tasks.forEach((task) =>
        loadTaskImages(task.images as TestScreenshots)
      );
    }
  }, [test]);

  const total = test
    ? test.tasks.length *
      (Object.values(test.tasks[0].images as TestScreenshots).length -
        IMAGE_OF_ENTIRE_SCENE)
    : 0;

  return {
    total: total,
    progress: progress,
  };
}
