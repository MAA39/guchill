import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./auth-schema";
import type { Env } from "./env";

/**
 * Better Auth インスタンスをリクエストごとに生成する
 * ⚠️ Workers制約: モジュールスコープでdbインスタンスを共有してはいけない
 */
export function createAuth(env: Env) {
  const db = drizzle(env.DB, { schema });

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema,
    }),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL || "http://localhost:8787",
    basePath: "/api/auth",
    emailAndPassword: {
      enabled: true,
    },
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60,
      },
    },
    trustedOrigins: ["http://localhost:5173", "http://localhost:5174"],
  });
}

export async function getSessionFromRequest(
  env: Env,
  request: Request
): Promise<{ userId: string } | null> {
  const auth = createAuth(env);
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  if (!session?.user?.id) return null;
  return { userId: session.user.id };
}
