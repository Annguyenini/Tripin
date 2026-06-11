type coords = [number, number];
type observer = { update: (value: coords) => void };
let observers: observer[] = [];

export const addObserver = (observer: observer) => {
  observers.push(observer);
};
export default function setCoords(coords: coords): void {
  try {
    for (const observer of observers) {
      observer.update(coords);
    }
  } catch (error) {
    console.error(`Failed at update coords: ${error}`);
  }
}
