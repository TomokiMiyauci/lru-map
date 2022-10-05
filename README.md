# lru-map

Minimum LRU cache based on `Map` object.

## What

Essentially, what this project provides is a `Map` object with a limited maximum
number of items.

The LRU algorithm is used to handle items that exceed the maximum number.

Also, the interface is almost the same as the `Map` object. The only difference
is that you need to specify the maximum number of items.

Additionally, it does not do much to minimize the bundle size.

## Why

When you cache data, you should always be concerned about the size of the cache.

Endless caching will eat up all of your resources.

`Map` objects are limited to a maximum number of items of approximately 2^24.

If it is exceeded, a `RangeError` will be thrown.

```ts
let count = 0;
const map = new Map();

while (count < Math.pow(2, 25)) {
  map.set(count, count);
  count++;
}
```

This does not occur because LRUMap cannot hold more than the maximum number of
items.

Of course, if the maximum number is greater than 2^24, the result will be the
same as for the `Map` object.

## Basic usage

LRU Map and `Map` look almost the same. You must always give `maxSize` as a
constructor argument.

```ts
import { LRUMap } from "https://deno.land/x/lru_map@$VERSION/mod.ts";
const map = new LRUMap(100);
```

After that, it is used in the same way as `Map`.

## Initial entries

Initial entries are accepted as `Map`. The leftmost item is defined as the
oldest, so if there are too many items, they are overwritten from the left.

```ts
import { LRUMap } from "https://deno.land/x/lru_map@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

const map = new LRUMap(2, [[0, "left"], [1, "middle"], [2, "right"]]);
assertEquals([...map.values()], ["middle", "right"]);
```

## Iteration

When iterating over an item, there are a few things to keep in mind.

LRU Map keeps items in **Oldest Order**. Repeatedly retrieving an item will
return the items in the same order of oldest to newest.

```ts
import { LRUMap } from "https://deno.land/x/lru_map@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

const map = new LRUMap(2, [[0, "left"], [1, "middle"], [2, "right"]]);
map.set(3, "rightmost");

assertEquals([...map.values()], ["right", "rightmost"]);
```

## Side effects of operations

When an item is retrieved or set, it is considered most recently used.

As seen in [Iteration](#iteration), items are kept in order of oldest to newest,
so when these operations are performed, the order of the items will change.

```ts
import { LRUMap } from "https://deno.land/x/lru_map@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

const map = new LRUMap(2, [[0, "left"], [1, "middle"], [2, "right"]]);
assertEquals([...map.entries()], [[1, "middle"], [2, "right"]]);

map.set(3, "rightmost");
assertEquals([...map.entries()], [[2, "right"], [3, "rightmost"]]);

const right = map.get(2);
assertEquals([...map.entries()], [[3, "rightmost"], [2, "right"]]);
```

## License

Copyright © 2022-present [TomokiMiyauci](https://github.com/TomokiMiyauci).

Released under the [MIT](./LICENSE) license
