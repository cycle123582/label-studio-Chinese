/**
 * A simple LRU cache implementation
 * @param K - Key type
 * @param V - Value type
 * @example
 * const cache = new LRUCache<string, number>(10);
 * cache.set("foo", 1);
 * cache.set("bar", 2);
 * cache.set("baz", 3);
 * cache.set("qux", 4);
 */
export class LRUCache<K, V> {
  private maxSize: number;
  private map: Map<K, V>;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
    this.map = new Map();
  }

  get(key: K): V | undefined {
    if (!this.map.has(key)) return undefined;
    // Touch: move to end (most recently used)
    const value = this.map.get(key)!;
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  set(key: K, value: V): void {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.maxSize) {
      // Remove least recently used (first item)
      const lru = this.map.keys().next();
      if (!lru.done) {
        this.map.delete(lru.value);
      }
    }
    this.map.set(key, value);
  }

  has(key: K): boolean {
    return this.map.has(key);
  }

  get size(): number {
    return this.map.size;
  }

  values(): IterableIterator<V> {
    return this.map.values();
  }
}
