import { AIChatAgent } from "@cloudflare/ai-chat";
import { initSchema, type SqlTaggedTemplate } from "@guchill/do-schema";
import type { Env } from "./env";

export class GuchillAgent extends AIChatAgent<Env> {
  async onStart() {
    // this.sql は Agent 内部で this.onError を参照するため、
    // 別関数に渡すとコンテキストが死ぬ。ラッパーで this を維持する。
    const sql = ((strings: TemplateStringsArray, ...values: unknown[]) =>
      this.sql(strings, ...values)) as SqlTaggedTemplate;
    initSchema(sql);
  }

  async onChatMessage(): Promise<Response> {
    // Day 1: echo版（LLMなし）
    const lastMsg = this.messages[this.messages.length - 1];
    const text =
      lastMsg?.parts
        ?.filter((p: { type: string }) => p.type === "text")
        .map((p: { type: string; text?: string }) => p.text ?? "")
        .join("") ?? "（メッセージなし）";

    return new Response(`Echo: ${text}`, {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
}
