export type Timer = {
  stopTimer(): number;
  restartTimer(): void;
};

export const launchTimer = (): Timer => {
  let startTime = Date.now();

  return {
    stopTimer() {
      return Date.now() - startTime;
    },
    restartTimer() {
      startTime = Date.now();
    },
  };
};
