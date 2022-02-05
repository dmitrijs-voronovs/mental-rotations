// const e = new Event("Task completed");
// document.dispatchEvent(e);

export type CorrectAnswer = "Correct answer";
export type WrongAnswer = "Wrong answer";
export type Help = "Help";
export const HelpE: Help = "Help";

export type SimpleEventMap = {
  "Correct answer": Event;
  "Wrong answer": Event;
  Help: Event;
};

export type ComplexEventMap = {
  "Data: correct shape number": CustomEvent<number>;
  "Data: actual shape number": CustomEvent<number>;
};

export type EventMap = SimpleEventMap & ComplexEventMap;

export type DataCorrectShapeNumber = "Data: correct shape number";
export const DataCorrectShapeNumberE: DataCorrectShapeNumber =
  "Data: correct shape number";

export type DataActualShapeNumber = "Data: actual shape number";
export const DataActualShapeNumberE: DataActualShapeNumber =
  "Data: actual shape number";

export type DataCorrectShapeNumber_Data = number;
export type DataActualShapeNumber_Data = number;

export type AppSimpleEvent = CorrectAnswer | WrongAnswer | Help;

export type AppCustomEvent = DataCorrectShapeNumber | DataActualShapeNumber;

export type AppEvent = AppSimpleEvent | AppCustomEvent;

type EventData<T extends AppCustomEvent> =
  AppCustomEvent extends DataCorrectShapeNumber
    ? DataCorrectShapeNumber_Data
    : AppCustomEvent extends DataActualShapeNumber
    ? DataActualShapeNumber_Data
    : unknown;

export function createEvent<T extends AppEvent>(
  type: T,
  data?: T extends AppCustomEvent ? CustomEventInit<EventData<T>> : undefined
) {
  return new CustomEvent(type, data);
}

export function createEvent2<T extends keyof SimpleEventMap>(
  type: T
): SimpleEventMap[T];
export function createEvent2<T extends keyof ComplexEventMap>(
  type: T,
  data: ComplexEventMap[T]["detail"]
): ComplexEventMap[T];
export function createEvent2<T extends keyof SimpleEventMap | ComplexEventMap>(
  type: T,
  data?: unknown
) {
  if (!data) {
    return new Event(type as keyof SimpleEventMap);
  }
  return new CustomEvent(type as keyof ComplexEventMap, { detail: data });
}
