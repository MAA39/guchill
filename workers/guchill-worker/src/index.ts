import { Hono } from "hono";
import { getAgentByName } from "agents";
import type { Env } from "./env";

// Re-export for wrangler DO binding
export { GuchillAgent } from "./agent";

const app = new Hono<{ Bindings: Env }>();

// Day 1: 認証なし（Day 3で userId に切り替え）
app.all("/agent/*", async (c) => {
  const instanceName = "dev-user";
  const agent = await getAgentByName(c.env.GUCHILL_AGENT, instanceName);
  return agent.fetch(c.req.raw);
});

app.get("/health", (c) => c.text("ok"));

export default app;
