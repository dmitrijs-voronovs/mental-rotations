const e = new Event("Task completed");
document.dispatchEvent(e);

export type CorrectAnswer = "Correct answer";
export type WrongAnswer = "Wrong answer";
export type Help = "Help";
export const HelpE: Help = "Help";

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
