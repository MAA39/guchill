import { Hono } from "hono";
import { cors } from "hono/cors";
import { getAgentByName } from "agents";
import { createAuth, getSessionFromRequest } from "./auth";
import type { Env } from "./env";

export { GuchillAgent } from "./agent";

const app = new Hono<{ Bindings: Env }>();

app.use(
  "/api/*",
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.all("/api/auth/*", async (c) => {
  const auth = createAuth(c.env);
  return auth.handler(c.req.raw);
});

app.all("/agent/*", async (c) => {
  const session = await getSessionFromRequest(c.env, c.req.raw);
  const instanceName = session ? `user-${session.userId}` : "anon";
  const agent = await getAgentByName(c.env.GUCHILL_AGENT as any, instanceName);
  return agent.fetch(c.req.raw);
});

app.get("/health", (c) => c.text("ok"));

app.post("/api/migrate", async (c) => {
  const auth = createAuth(c.env);
  const { getMigrations } = await import("better-auth/db");
  const { runMigrations } = await getMigrations(auth.options);
  await runMigrations();
  return c.json({ ok: true, message: "migrations applied" });
});

export default app;
