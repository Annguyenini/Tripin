import SocketService from "../../../app-core/flow/web_socket/socket";
import { Friendships_events } from "../../../types/events/friendships_events.types";
import { UserData } from "../../../types/user_data.types";

interface Observer {
  update(value: Friendships_events, data: UserData): void;
}

class FriendshipsObserver {
  private observers: Map<Friendships_events, Observer[]> = new Map([
    ["friend_request", []],
    ["friend_removed", []],
    ["friend_reject", []],
    ["friend_cancel", []],
    ["friend_accept", []],
  ]);

  constructor() {
    const events: Friendships_events[] = [
      "friend_request",
      "friend_removed",
      "friend_reject",
      "friend_cancel",
      "friend_accept",
    ];

    events.forEach(event => {
      SocketService.addEvent(
        event,
        this.socketCallback.bind(this)
      );
    });
  }

  private socketCallback(event: Friendships_events, data: UserData) {
    this.notify(event, data);
  }

  attach(event: Friendships_events, observer: Observer) {
    try {
      const observers = this.observers.get(event) ?? [];

      // prevent duplicate observer
      if (!observers.includes(observer)) {
        observers.push(observer);
      }

      this.observers.set(event, observers);
    }
    catch (err) {
      console.error(`failed to add into observer list: ${err}`);
    }
  }

  detach(event: Friendships_events, observer: Observer) {
    try {
      const observers = this.observers.get(event);

      if (!observers) return;

      this.observers.set(
        event,
        observers.filter(obs => obs !== observer)
      );
    }
    catch (error) {
      console.error(`failed to remove from observer list: ${error}`);
    }
  }

  notify(event: Friendships_events, data: UserData) {
    try {
      const observers = this.observers.get(event) ?? [];

      for (const observer of observers) {
        observer.update(event, data);
      }
    }
    catch (error) {
      console.error(`failed to notify observer list: ${error}`);
    }
  }
}

export default new FriendshipsObserver();
