// Copyright 2022-latest TomokiMiyauci. All rights reserved. MIT license.
// This module is browser compatible.

// deno-lint-ignore-file no-explicit-any no-empty-interface

export interface LRUMapConstructor {
  new <K, V>(
    maxSize: number,
    entries?: readonly (readonly [K, V])[] | null,
  ): Map<K, V>;

  readonly prototype: LRUMap<any, any>;
}

function _createLRUMap<K, V>(
  maxSize: number,
  iterable: Iterable<readonly [K, V]> | null | undefined,
): Map<K, V> {
  class LRUMap extends Map<K, V> {
    override set(key: K, value: V): this {
      if (this.has(key)) return this.rollup(key, value);

      if (maxSize <= this.size) this.delete(this.firstKey);

      if (maxSize > this.size) return super.set(key, value);

      return this;
    }

    override get(key: K): V | undefined {
      const has = this.has(key);
      const value = super.get(key);

      if (has) {
        this.rollup(key, value!);
      }

      return value;
    }

    private rollup(key: K, value: V): this {
      super.delete(key);
      return super.set(key, value);
    }

    private get firstKey(): K {
      return this.keys().next().value;
    }
  }

  return new LRUMap(iterable);
}

/** LRU cache based on `Map` object.
 *
 * ```ts
 * import { LRUMap } from "https://deno.land/x/lru_map@$VERSION/mod.ts";
 * const cache = new LRUMap(100);
 * ```
 */
export const LRUMap: LRUMapConstructor =
  _createLRUMap as unknown as LRUMapConstructor;

export interface LRUMap<K, V> extends Map<K, V> {}
