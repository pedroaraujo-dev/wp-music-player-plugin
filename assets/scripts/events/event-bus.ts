type EventCallback<T = any> = (data: T) => void;

type EventMap = Record<string, any>;

class _EventBus<Events extends EventMap = Record<string, any>> {
  private events: { [K in keyof Events]?: EventCallback<Events[K]>[] } = {};

  on<K extends keyof Events>(event: K, callback: EventCallback<Events[K]>): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event]!.push(callback);
  }

  off<K extends keyof Events>(event: K, callback: EventCallback<Events[K]>): void {
    if (!this.events[event]) return;
    this.events[event] = this.events[event]!.filter(cb => cb !== callback);
  }

  emit<K extends keyof Events>(event: K, data?: Events[K]): void {
    if (!this.events[event]) return;
    this.events[event]!.forEach(cb => cb(data as Events[K]));
  }
}

interface AppEvents {
  "playlist:updated": void;
}

export const EventBus = new _EventBus<AppEvents>();
