import { AIChatAgent } from "@cloudflare/ai-chat";
import {
  streamText,
  convertToModelMessages,
  stepCountIs,
  tool,
} from "ai";
import { initSchema, type SqlTaggedTemplate } from "@guchill/do-schema";
import { getModel } from "@guchill/llm";
import { RecordCbtStepInput, PresentChoicesInput } from "@guchill/tools";
import { isCrisisText, crisisResponseJa } from "@guchill/safety";
import { CBT_SYSTEM_PROMPT } from "./prompts/cbt-system";
import type { Env } from "./env";

export class GuchillAgent extends AIChatAgent<Env> {
  async onStart() {
    const sql = ((
      strings: TemplateStringsArray,
      ...values: (string | number | boolean | null)[]
    ) => this.sql(strings, ...values)) as SqlTaggedTemplate;
    initSchema(sql);
  }

  async onChatMessage(): Promise<Response> {
    // === Crisis Gate (before LLM) ===
    const lastMsg = this.messages[this.messages.length - 1];
    const lastUserText =
      lastMsg?.parts
        ?.filter((p: { type: string }) => p.type === "text")
        .map((p: { type: string; text?: string }) => p.text ?? "")
        .join("") ?? "";

    if (isCrisisText(lastUserText)) {
      return new Response(crisisResponseJa(), {
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }

    // === Normal LLM conversation ===
    const model = getModel(this.env);
    const doSql = this.sql.bind(this);

    const result = streamText({
      model,
      system: CBT_SYSTEM_PROMPT,
      messages: await convertToModelMessages(this.messages),
      tools: {
        // Day 5: CBT step extraction (server tool)
        record_cbt_step: tool({
          description:
            "Extract and record CBT steps from user utterance. Call for every user message.",
          inputSchema: RecordCbtStepInput,
          execute: async (input) => {
            const id = crypto.randomUUID();
            const now = Date.now();
            const sessionId = "current";

            doSql`INSERT INTO cbt_steps (id, session_id, step_type, payload_json, created_at)
              VALUES (${id}, ${sessionId}, ${input.step_type}, ${JSON.stringify({
              quote_span: input.quote_span,
              confidence: input.confidence,
            })}, ${now})`;

            return {
              recorded: true,
              id,
              step_type: input.step_type,
              quote_span: input.quote_span,
            };
          },
        }),
        // Day 6: 3-choice presentation (client tool - no execute)
        present_choices: tool({
          description:
            "Present 3 choices to user. Used at each CBT stage. Always exactly 3 choices.",
          inputSchema: PresentChoicesInput,
        }),
      },
      stopWhen: stepCountIs(8),
    });

    return result.toUIMessageStreamResponse();
  }
}
