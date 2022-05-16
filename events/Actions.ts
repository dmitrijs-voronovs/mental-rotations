import { ProjectEventMap } from "./Events";

type SimpleEventKeys = {
  [Key in keyof ProjectEventMap]: ProjectEventMap[Key] extends CustomEvent
    ? never
    : Key;
}[keyof ProjectEventMap];
type CustomEventKeys = Exclude<keyof ProjectEventMap, SimpleEventKeys>;

export function dispatchProjectEvent<T extends SimpleEventKeys>(name: T): void;
export function dispatchProjectEvent<T extends CustomEventKeys>(
  name: T,
  data: ProjectEventMap[T]["detail"]
): void;
export function dispatchProjectEvent<T extends keyof ProjectEventMap>(
  name: T,
  data?: ProjectEventMap[T] extends CustomEvent
    ? ProjectEventMap[T]["detail"]
    : never
): void {
  if (data) {
    document.dispatchEvent(new CustomEvent(name, { detail: data }));
  } else {
    document.dispatchEvent(new Event(name));
  }
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
