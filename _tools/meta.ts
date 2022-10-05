import { BuildOptions } from "https://deno.land/x/dnt@0.30.0/mod.ts";

export const makeOptions = (version: string): BuildOptions => ({
  test: false,
  shims: {},
  typeCheck: true,
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  package: {
    name: "@miyauci/lru-map",
    version,
    description: "Minimum LRU cache based on Map object",
    keywords: [
      "lru",
      "cache",
      "map",
    ],
    license: "MIT",
    homepage: "https://github.com/TomokiMiyauci/lru-map",
    repository: {
      type: "git",
      url: "git+https://github.com/TomokiMiyauci/lru-map.git",
    },
    bugs: {
      url: "https://github.com/TomokiMiyauci/lru-map/issues",
    },
    sideEffects: false,
    type: "module",
    publishConfig: {
      access: "public",
    },
  },
  packageManager: "pnpm",
});
