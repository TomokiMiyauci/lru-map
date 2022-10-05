import { LRUMap } from "./lru_map.ts";
import {
  assertEquals,
  assertInstanceOf,
  assertNotEquals,
  assertThrows,
  describe,
  it,
} from "./dev_deps.ts";

const OVER_MAX_SAFE_ITEMS = Math.pow(2, 25); // 2^24 is max

function assertEqualsLRU(
  left: LRUMap<unknown, unknown>,
  right: Map<unknown, unknown>,
) {
  assertEquals(new Map(left.entries()), right);
  assertEquals([...left.entries()], [...right.entries()]);
}

describe("LRUMap", () => {
  it("should equal Map", () => {
    assertInstanceOf(new LRUMap(0), Map);
  });

  it("should not equal prototype Map", () => {
    assertNotEquals(LRUMap.prototype, Map.prototype);
  });

  it("should rollup entries limited by max size", () => {
    const key = {};
    const table: [
      actual: Map<unknown, unknown>,
      result: Map<unknown, unknown>,
    ][] = [
      [new LRUMap(0, []), new Map()],
      [new LRUMap(1, [[0, 1]]), new Map([[0, 1]])],
      [new LRUMap(0, [[0, 1]]), new Map()],
      [new LRUMap(-1, [[0, 1]]), new Map()],
      [new LRUMap(NaN, [[0, 1]]), new Map()],
      [
        new LRUMap(2, [[0, 1], [1, 2], [2, 3], [3, 4]]),
        new Map([[2, 3], [3, 4]]),
      ],
      [
        new LRUMap(2, [[0, 1], [1, 2], [2, 3], [3, 4]]),
        new Map([[2, 3], [3, 4]]),
      ],
      [new LRUMap(1, [[{}, {}]]), new Map([[{}, {}]])],
      [new LRUMap(2, [[{}, {}], [{}, {}]]), new Map([[{}, {}], [{}, {}]])],
      [new LRUMap(2, [[key, {}], [key, {}]]), new Map([[key, {}]])],
    ];

    table.forEach(([actual, expected]) => {
      assertEqualsLRU(actual, expected);
    });
  });

  it("should rollup entries when set value", () => {
    const table: [
      actual: Map<unknown, unknown>,
      result: Map<unknown, unknown>,
    ][] = [
      [new LRUMap(0).set("", ""), new Map()],
      [new LRUMap(0).set("", "").set("a", "b"), new Map()],
      [new LRUMap(-1).set("", ""), new Map()],
      [new LRUMap(1).set("", ""), new Map([["", ""]])],
      [new LRUMap(1).set("", "a").set("", "b"), new Map([["", "b"]])],
      [new LRUMap(1).set("", "a").set("a", "b"), new Map([["a", "b"]])],
      [
        new LRUMap(1).set("", "a").set("a", "b").set("b", "c"),
        new Map([["b", "c"]]),
      ],
      [
        new LRUMap(1).set("", "a").set("", "b").set("", "c"),
        new Map([["", "c"]]),
      ],
      [
        new LRUMap(2).set("", ""),
        new Map([["", ""]]),
      ],
      [
        new LRUMap(2).set("", "").set("", ""),
        new Map([["", ""]]),
      ],
      [
        new LRUMap(2).set("", "").set("", "a"),
        new Map([["", "a"]]),
      ],
      [
        new LRUMap(2).set("", "").set("", "a").set("a", "b"),
        new Map([["", "a"], ["a", "b"]]),
      ],
      [
        new LRUMap(2).set("", "").set("a", "a").set("b", "b").set("c", "c"),
        new Map([["b", "b"], ["c", "c"]]),
      ],
      [
        new LRUMap(2).set("", "").set("a", "a").set("b", "b").set("a", "new"),
        new Map([["b", "b"], ["a", "new"]]),
      ],
    ];

    table.forEach(([actual, expected]) => {
      assertEqualsLRU(actual, expected);
    });
  });

  it("should rollup entries when get the key", () => {
    const lrn = new LRUMap(5, [["", ""], ["a", "a"]]);
    lrn.get("");

    assertEqualsLRU(lrn, new Map([["a", "a"], ["", ""]]));
  });

  it("should not rollup entries when the key does not exists", () => {
    const lrn = new LRUMap(5, [["", ""], ["a", "a"]]);
    lrn.get("b");

    assertEqualsLRU(lrn, new Map([["", ""], ["a", "a"]]));
  });

  it("should equal map complex pattern", () => {
    const lru = new LRUMap(4, [["", ""], ["a", "a"], ["b", "b"]]);

    lru.set("", "new ");
    lru.get("a");
    lru.set("c", "c");
    lru.get("");
    lru.set("d", "d");

    assertEqualsLRU(
      lru,
      new Map([["a", "a"], ["c", "c"], ["", "new "], ["d", "d"]]),
    );
  });

  it("should throw error when map items exceed 2^24", () => {
    const m = new Map();

    assertThrows(() => {
      for (const a of range(OVER_MAX_SAFE_ITEMS)) {
        m.set(a, a);
      }
    });
  });

  it("should not throw error when the LRU has limit", () => {
    const m = new LRUMap(1);
    for (const a of range(OVER_MAX_SAFE_ITEMS)) {
      m.set(a, a);
    }
    assertEquals(m.size, 1);
  });

  it("should throw error when the LRU limit exceed map limit", () => {
    const m = new LRUMap(OVER_MAX_SAFE_ITEMS);

    assertThrows(() => {
      for (const a of range(OVER_MAX_SAFE_ITEMS)) {
        m.set(a, a);
      }
    });
  });

  it("should success the examples", () => {
    const map = new LRUMap(2, [[0, "left"], [1, "right"]]);
    assertEquals([...map.entries()], [[0, "left"], [1, "right"]]);

    map.get(0);
    assertEquals([...map.entries()], [[1, "right"], [0, "left"]]);
  });
});

function* range(limit: number): Generator<number, void, unknown> {
  let count = 0;
  while (count < limit) {
    yield count;
    count++;
  }
}
