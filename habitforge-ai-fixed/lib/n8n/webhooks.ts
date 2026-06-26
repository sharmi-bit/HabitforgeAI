type N8nWorkflow = "streak-milestone" | "goal-completed" | "plan-generated" | "habit-missed";

export async function triggerN8nWorkflow(
  workflow: N8nWorkflow,
  payload: Record<string, unknown>
): Promise<void> {
  const baseUrl = process.env.N8N_WEBHOOK_BASE_URL;
  if (!baseUrl) return; // n8n not configured, skip silently

  try {
    await fetch(`${baseUrl}/${workflow}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error(`n8n webhook ${workflow} failed:`, err);
    // Non-fatal: don't throw, automation failures shouldn't break the app
  }
}
