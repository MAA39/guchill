// Worker環境変数の型定義
export interface Env {
  GUCHILL_AGENT: DurableObjectNamespace;
  DB: D1Database;
  AI: Ai;
  AI_PROVIDER: "workers_ai" | "anthropic" | "openai";
  WORKERS_AI_MODEL?: string;
  ANTHROPIC_API_KEY?: string;
  ANTHROPIC_MODEL?: string;
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
  BETTER_AUTH_SECRET?: string;
  BETTER_AUTH_URL?: string;
}
