import { EventEmitter } from "events";

class UiEventBus {
  private observers = {};
  private items = {};
  on(key, obs) {
    if (!this.observers[key]) {
      this.observers[key] = [];
    }
    this.observers[key].push(obs);
  }
  off(key, obs) {
    this.observers[key] = this.observers[key].filter((ob) => ob !== obs);
  }
  getValueFromKey(key) {
    return this.items[key];
  }
  emit(key, val) {
    this.items[key] = val;
    for (const obs of this.observers[key]) {
      obs(val);
    }
  }
}
export default new UiEventBus();
