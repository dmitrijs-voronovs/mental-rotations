const e = new Event("Task completed");
document.dispatchEvent(e);

type CorrectAnswer = "Correct answer";
type WrongAnswer = "Wrong answer";
export type Event = CorrectAnswer | WrongAnswer;

export function createEvent(type: Event) {
  return new Event(type);
}
