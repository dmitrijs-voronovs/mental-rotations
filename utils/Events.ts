export interface Print extends CustomEvent<string[]> {}
export interface CorrectAnswer extends CustomEvent<number> {}
export interface ActualAnswer extends CustomEvent<number> {}
export interface Help extends Event {}

type ProjectEventMap = {
  print: Print;
  help: Help;
  actualAnswer: ActualAnswer;
  correctAnswer: CorrectAnswer;
};

type SimpleEventKeys = {
  [Key in keyof ProjectEventMap]: ProjectEventMap[Key] extends CustomEvent
    ? never
    : Key;
}[keyof ProjectEventMap];
type CustomEventKeys = Exclude<keyof ProjectEventMap, SimpleEventKeys>;

declare global {
  export interface DocumentEventMap extends ProjectEventMap {}
}

export function createEvent<T extends SimpleEventKeys>(
  name: T
): ProjectEventMap[T];
export function createEvent<T extends CustomEventKeys>(
  name: T,
  data: ProjectEventMap[T]["detail"]
): ProjectEventMap[T];
export function createEvent<T extends keyof ProjectEventMap>(
  name: T,
  data?: ProjectEventMap[T] extends CustomEvent
    ? ProjectEventMap[T]["detail"]
    : never
): ProjectEventMap[T] {
  if (data) {
    return new CustomEvent(name, { detail: data });
  }
  return new Event(name) as any;
}

export function listenToProjectEvents<T extends keyof ProjectEventMap>(
  name: T,
  callback: (event: ProjectEventMap[T]) => void,
  options?: Parameters<typeof document.addEventListener>[2]
): void {
  document.addEventListener(name, callback, options);
}

export function removeProjectEventListener<T extends keyof ProjectEventMap>(
  name: T,
  callback: (event: ProjectEventMap[T]) => void
): void {
  document.removeEventListener(name, callback);
}
