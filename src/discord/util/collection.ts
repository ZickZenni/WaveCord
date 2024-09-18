export default class Collection<K, V> {
  private map: Map<K, V> = new Map();

  public set(key: K, value: V) {
    this.map.set(key, value);
  }

  public get(key: K): V | undefined {
    return this.map.get(key);
  }

  public delete(key: K) {
    this.map.delete(key);
  }

  public has(key: K) {
    return this.map.has(key);
  }

  public values() {
    return [...this.map.values()];
  }

  public keys() {
    return [...this.map.keys()];
  }
}
