type LogType = 'hydration' | 'memory' | 'performance';

interface DebugLog {
  id: string;
  type: LogType;
  message: string;
  timestamp: number;
  data?: unknown;
}

class DebugStore {
  private readonly logs: DebugLog[] = [];
  private readonly listeners: Set<() => void> = new Set();

  addLog(type: LogType, message: string, data?: unknown) {
    const log: DebugLog = {
      id: Math.random().toString(36).substring(2, 11),
      type,
      message,
      timestamp: Date.now(),
      data
    };
    this.logs.unshift(log);
    if (this.logs.length > 100) this.logs.pop();
    this.notify();
  }

  getLogs() {
    return this.logs;
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }
}

export const debugStore = new DebugStore();
