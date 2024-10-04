type Value = string | number | boolean | object;

export type LogFunc = (...params: Value[]) => void;

export interface Logger {
  log: LogFunc;
  error: LogFunc;
}

export class ConsoleLogger implements Logger {
  log(...params: Value[]): void {
    console.log(...params);
  }
  error(...params: Value[]): void {
    console.error(...params);
  }
}

export class NoopLogger implements Logger {
  log() { }
  error() { }
}

export type LogCallback = (which: "log" | "error", ...params: Value[]) => void;

export class FnLogger implements Logger {
  fn: LogCallback;

  constructor(fn: LogCallback) {
    if (fn === null) {
      throw new Error("fn cannot be null");
    }

    this.fn = fn;
  }

  log(...params: Value[]): void {
    this.fn('log', ...params);
  }

  error(...params: Value[]): void {
    this.fn('error', ...params);
  }
}
