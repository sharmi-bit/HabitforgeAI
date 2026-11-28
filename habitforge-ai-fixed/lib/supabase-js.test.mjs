import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";

import { createClient } from "@supabase/supabase-js";

const require = createRequire(import.meta.url);
const sdkPackage = JSON.parse(
  readFileSync(require.resolve("@supabase/supabase-js/package.json"), "utf8"),
);

test("the app uses @supabase/supabase-js 2.119.2+ and keeps the auth API useAuth relies on", () => {
  const [major, minor, patch] = sdkPackage.version
    .split(".")
    .map((part) => Number.parseInt(part, 10));

  assert.ok(
    major > 2 ||
      (major === 2 &&
        (minor > 119 || (minor === 119 && patch >= 2))),
    `expected @supabase/supabase-js 2.119.2 or newer, found ${sdkPackage.version}`,
  );

  // Synthetic credentials only: creating the client must not perform I/O.
  const client = createClient(
    "https://example.supabase.co",
    "anon-key",
  );

  // hooks/useAuth.ts imports the User type, calls auth.getUser() and
  // subscribes with auth.onAuthStateChange(), then unsubscribes on unmount.
  assert.equal(typeof client.auth.getUser, "function");
  assert.equal(typeof client.auth.onAuthStateChange, "function");

  const { data } = client.auth.onAuthStateChange(() => {});
  assert.equal(typeof data.subscription.unsubscribe, "function");
  data.subscription.unsubscribe();
});
