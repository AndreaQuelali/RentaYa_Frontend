type SessionCallback = () => void;

class SimpleEventEmitter {
  private listeners: Map<string, SessionCallback[]> = new Map();

  on(event: string, callback: SessionCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  off(event: string, callback: SessionCallback) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event: string) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((cb) => cb());
    }
  }
}

export const sessionEvents = new SimpleEventEmitter();

export const SESSION_EVENTS = {
  INVALID: "session:invalid",
  CLEARED: "session:cleared",
} as const;
