/**
 * AI Service Abstraction Layer
 *
 * All AI calls go through this single function.
 * Switch providers by changing the env vars — no other code changes needed.
 *
 * Supported providers (set AI_PROVIDER in .env):
 *   "anthropic"  — Anthropic Claude API (default)
 *   "openai"     — OpenAI-compatible API
 *   "huggingface"— Hugging Face Inference API
 *   "custom"     — Any OpenAI-compatible custom endpoint (e.g. Together, Groq)
 */

export interface AIServiceOptions {
  systemPrompt?: string;
  maxTokens?: number;
}

export async function generateResponse(
  userPrompt: string,
  options: AIServiceOptions = {}
): Promise<string> {
  const provider = process.env.AI_PROVIDER ?? "anthropic";

  switch (provider) {
    case "anthropic":
      return callAnthropic(userPrompt, options);
    case "openai":
    case "custom":
      return callOpenAICompatible(userPrompt, options);
    case "huggingface":
      return callHuggingFace(userPrompt, options);
    default:
      throw new Error(`Unknown AI_PROVIDER: "${provider}". Use "anthropic", "openai", "huggingface", or "custom".`);
  }
}

// ── Anthropic Claude ────────────────────────────────────────────────────────
async function callAnthropic(prompt: string, options: AIServiceOptions): Promise<string> {
  const apiKey = process.env.AI_API_KEY ?? process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("AI_API_KEY is not set");

  const model = process.env.AI_MODEL ?? "claude-haiku-4-5-20251001";
  const messages: { role: "user" | "assistant"; content: string }[] = [
    { role: "user", content: prompt },
  ];

  const body: Record<string, unknown> = {
    model,
    max_tokens: options.maxTokens ?? 1024,
    messages,
  };
  if (options.systemPrompt) body.system = options.systemPrompt;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text ?? "";
}

// ── OpenAI / OpenAI-compatible (Groq, Together, custom) ────────────────────
async function callOpenAICompatible(prompt: string, options: AIServiceOptions): Promise<string> {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) throw new Error("AI_API_KEY is not set");

  const baseUrl = process.env.AI_MODEL_API_URL ?? "https://api.openai.com/v1";
  const model = process.env.AI_MODEL ?? "gpt-4o-mini";

  const messages: { role: string; content: string }[] = [];
  if (options.systemPrompt) messages.push({ role: "system", content: options.systemPrompt });
  messages.push({ role: "user", content: prompt });

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: options.maxTokens ?? 1024,
      messages,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI-compatible API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

// ── Hugging Face Inference API ──────────────────────────────────────────────
async function callHuggingFace(prompt: string, options: AIServiceOptions): Promise<string> {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) throw new Error("AI_API_KEY is not set");

  const model = process.env.AI_MODEL ?? "mistralai/Mistral-7B-Instruct-v0.3";
  const fullPrompt = options.systemPrompt
    ? `${options.systemPrompt}\n\n${prompt}`
    : prompt;

  const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      inputs: fullPrompt,
      parameters: { max_new_tokens: options.maxTokens ?? 1024, return_full_text: false },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Hugging Face API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return Array.isArray(data) ? (data[0]?.generated_text ?? "") : (data.generated_text ?? "");
}
