// Worker環境変数の型定義
export interface Env {
  GUCHILL_AGENT: DurableObjectNamespace;
  DB: D1Database;
  AI: Ai;
  AI_PROVIDER: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  ANTHROPIC_API_KEY?: string;
}
