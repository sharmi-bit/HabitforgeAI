import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import path from "node:path";

import * as sonner from "sonner";

const require = createRequire(import.meta.url);
const sonnerEntry = require.resolve("sonner");
const sonnerPackage = JSON.parse(
  readFileSync(path.join(path.dirname(sonnerEntry), "..", "package.json"), "utf8"),
);

test("the app uses sonner 2.x and the toast API its call sites rely on", () => {
  const major = Number.parseInt(sonnerPackage.version.split(".")[0], 10);
  assert.ok(
    major >= 2,
    `expected the installed sonner to be v2 or newer, found ${sonnerPackage.version}`,
  );

  // Every call site in the app uses toast.success/toast.error and the Toaster
  // component; those exports must remain available across the major upgrade.
  assert.equal(typeof sonner.toast.success, "function");
  assert.equal(typeof sonner.toast.error, "function");
  assert.equal(typeof sonner.Toaster, "object");
});
