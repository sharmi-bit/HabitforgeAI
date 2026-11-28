import { test } from "node:test";
import assert from "node:assert/strict";

import { generateResponse } from "./aiService.ts";

test("Anthropic requests send the API version supported by SDK 1.x", async () => {
  const previousProvider = process.env.AI_PROVIDER;
  const previousAnthropicKey = process.env.ANTHROPIC_API_KEY;
  const previousAiKey = process.env.AI_API_KEY;
  const previousFetch = globalThis.fetch;

  process.env.AI_PROVIDER = "anthropic";
  process.env.ANTHROPIC_API_KEY = "test-key";
  delete process.env.AI_API_KEY;

  let captured;
  globalThis.fetch = async (url, init) => {
    captured = { url, init };
    return {
      ok: true,
      json: async () => ({ content: [{ type: "text", text: "hello back" }] }),
    };
  };

  try {
    const text = await generateResponse("hello", { maxTokens: 16 });

    assert.equal(text, "hello back");
    assert.equal(captured.url, "https://api.anthropic.com/v1/messages");
    assert.equal(captured.init.headers["anthropic-version"], "2026-10-21");
  } finally {
    globalThis.fetch = previousFetch;

    if (previousProvider === undefined) delete process.env.AI_PROVIDER;
    else process.env.AI_PROVIDER = previousProvider;

    if (previousAnthropicKey === undefined) delete process.env.ANTHROPIC_API_KEY;
    else process.env.ANTHROPIC_API_KEY = previousAnthropicKey;

    if (previousAiKey === undefined) delete process.env.AI_API_KEY;
    else process.env.AI_API_KEY = previousAiKey;
  }
});
