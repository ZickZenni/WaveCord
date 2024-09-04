interface CachePair<K, V> {
  key: K;
  value: V;
  timeAdded: number;
}

export interface CacheOptions {
  timeLimit?: number;
}

export class CacheHolder<K, V> {
  private keysArray: K[] = [];

  private valuesArray: CachePair<K, V>[] = [];

  private readonly options: CacheOptions;

  constructor(options?: CacheOptions) {
    this.options = options ?? {};
  }

  public has(key: K): boolean {
    return this.keysArray.includes(key);
  }

  public set(key: K, value: V | undefined) {
    if (this.has(key)) {
      this.removeKey(key);
      this.removeValue(key);
    }

    if (value === undefined) return;

    this.keysArray.push(key);
    this.valuesArray.push({
      key,
      value,
      timeAdded: Date.now(),
    });
  }

  public get(key: K): V | undefined {
    return this.has(key)
      ? this.valuesArray[this.valuesArray.findIndex((v) => v.key === key)].value
      : undefined;
  }

  public expired(key: K): boolean {
    if (!this.has(key) || this.options.timeLimit === undefined) return false;

    const pair = this.getPair(key);
    if (pair === undefined) return false;

    const now = Date.now();

    if (now - (pair.timeAdded + this.options.timeLimit) >= 0) {
      return true;
    }
    return false;
  }

  public values(): V[] {
    return this.valuesArray.map((v) => v.value);
  }

  public keys(): K[] {
    return this.keysArray;
  }

  private getPair(key: K): CachePair<K, V> | undefined {
    return this.has(key)
      ? this.valuesArray[this.valuesArray.findIndex((v) => v.key === key)]
      : undefined;
  }

  private removeKey(key: K) {
    if (!this.has(key)) return;

    delete this.keysArray[this.keysArray.indexOf(key)];
  }

  private removeValue(key: K) {
    if (this.valuesArray.find((v) => v.key === key) === undefined) return;

    delete this.valuesArray[this.valuesArray.findIndex((v) => v.key === key)];
  }
}
