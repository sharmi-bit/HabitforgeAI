import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import path from "node:path";

import Anthropic from "@anthropic-ai/sdk";

const require = createRequire(import.meta.url);
const sdkEntry = require.resolve("@anthropic-ai/sdk");
const sdkPackage = JSON.parse(
  readFileSync(path.join(path.dirname(sdkEntry), "package.json"), "utf8"),
);

test("the app uses @anthropic-ai/sdk 1.14+ and keeps the client API its call sites rely on", () => {
  const [major, minor] = sdkPackage.version
    .split(".")
    .map((part) => Number.parseInt(part, 10));

  assert.ok(
    major > 1 || (major === 1 && minor >= 14),
    `expected @anthropic-ai/sdk 1.14.0 or newer, found ${sdkPackage.version}`,
  );

  // lib/claude/client.ts constructs the default client with an apiKey, and
  // lib/ai/aiService.ts calls the Messages endpoint directly.
  const client = new Anthropic({ apiKey: "test-key" });
  assert.equal(typeof client.messages.create, "function");
});
