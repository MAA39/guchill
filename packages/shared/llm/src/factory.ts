import { type LanguageModel } from "ai";
import { createWorkersAI } from "workers-ai-provider";

export interface LLMEnv {
  AI: Ai;
  AI_PROVIDER?: "workers_ai" | "anthropic" | "openai";
  WORKERS_AI_MODEL?: string;
  ANTHROPIC_API_KEY?: string;
  ANTHROPIC_MODEL?: string;
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
}

const DEFAULT_WORKERS_AI_MODEL = "@cf/qwen/qwen2.5-coder-32b-instruct";

export function getModel(env: LLMEnv): LanguageModel {
  const provider = env.AI_PROVIDER ?? "workers_ai";

  switch (provider) {
    case "workers_ai": {
      const workersAI = createWorkersAI({ binding: env.AI });
      const model = env.WORKERS_AI_MODEL ?? DEFAULT_WORKERS_AI_MODEL;
      return workersAI(model);
    }

    case "anthropic": {
      throw new Error(
        "Anthropic provider not yet implemented. Set AI_PROVIDER=workers_ai"
      );
    }

    case "openai": {
      throw new Error(
        "OpenAI provider not yet implemented. Set AI_PROVIDER=workers_ai"
      );
    }

    default: {
      const _exhaustive: never = provider;
      throw new Error(`Unknown AI_PROVIDER: ${_exhaustive}`);
    }
  }
}
