import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const require = createRequire(import.meta.url);
const resolversPackage = JSON.parse(
  readFileSync(require.resolve("@hookform/resolvers/package.json"), "utf8"),
);

test("the app uses @hookform/resolvers 7.0.9+ and the zod resolver the auth forms rely on", async () => {
  const [major, minor, patch] = resolversPackage.version
    .split(".")
    .map((part) => Number.parseInt(part, 10));
  const atLeast = (wantMajor, wantMinor, wantPatch) =>
    major > wantMajor ||
    (major === wantMajor &&
      (minor > wantMinor || (minor === wantMinor && patch >= wantPatch)));

  assert.ok(
    atLeast(7, 0, 9),
    `expected @hookform/resolvers 7.0.9 or newer, found ${resolversPackage.version}`,
  );

  // Every form (auth pages, GoalForm, ProfileForm) imports zodResolver from
  // the "@hookform/resolvers/zod" subpath and calls it with a single schema.
  assert.equal(typeof zodResolver, "function");

  const schema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });
  const resolver = zodResolver(schema);
  const options = { fields: {}, shouldUseNativeValidation: false };

  const invalid = await resolver(
    { email: "not-an-email", password: "short" },
    undefined,
    options,
  );
  assert.deepEqual(Object.keys(invalid.errors).sort(), ["email", "password"]);
  assert.equal(invalid.errors.email?.message, "Invalid email address");

  const valid = await resolver(
    { email: "user@example.com", password: "correct-horse" },
    undefined,
    options,
  );
  assert.deepEqual(valid.errors, {});
  assert.deepEqual(valid.values, {
    email: "user@example.com",
    password: "correct-horse",
  });
});
