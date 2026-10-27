import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Guards the dependency-security bumps applied in this change:
// - zod 3.25.76 -> 4.6.6 (GHSA-mrhx-c7xc-m3w5)
// - postcss 8.5.15 -> 8.5.18 (GHSA-r28c-9q8g-f849)
// - browserslist 4.28.4 -> 4.28.7 (GHSA-73wf-gq98-2v4g, GHSA-c83g-rgw3-j3cx)
// - source-map-js 1.2.1 -> 1.2.2 (GHSA-68fv-2mgg-jv7q)

const root = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const lock = JSON.parse(readFileSync(join(root, "package-lock.json"), "utf8"));

test("direct dependencies are pinned to patched versions", () => {
  assert.equal(pkg.dependencies.zod, "4.6.6");
  assert.equal(pkg.devDependencies.postcss, "8.5.18");
});

test("lockfile resolves patched versions", () => {
  const resolved = (name, version) => {
    assert.ok(lock.packages[`node_modules/${name}`], `${name} present in lockfile`);
    assert.equal(lock.packages[`node_modules/${name}`].version, version);
  };
  resolved("zod", "4.6.6");
  resolved("postcss", "8.5.18");
  resolved("browserslist", "4.28.7");
  resolved("source-map-js", "1.2.2");
});
