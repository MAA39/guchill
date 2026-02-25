# GuChill — CLAUDE.md

## 絶対ルール
- throw禁止。エラーはResult型 or Effect.failで表現
- テスト書いてから実装（TDD）
- 「動いてます」は禁止。wrangler dev + curl で証拠を見せる
- 3回修正してダメならアーキテクチャを疑う（Superpowers準拠）

## 技術スタック
- Runtime: Cloudflare Workers
- Framework: Hono
- Agent: @cloudflare/ai-chat@0.1.4 (AIChatAgent)
- DB: D1 + DO SQLite
- Auth: Better Auth (auth.api.getSession({ headers }))
- LLM: Workers AI (glm-4.7-flash) via workers-ai-provider
- AI SDK: v6（v5ではない！）
- Frontend: React + useAgentChat (@cloudflare/ai-chat/react)

## AI SDK v6 注意点（ADR-009）
- `convertToModelMessages` はasync → 必ず `await`
- `stopWhen: stepCountIs(8)` を必ず明示（デフォルト20は暴走リスク）
- `maxSteps` は使わない（v5の遺物）

## CBT設計原則
- AIは答えを出さない。事実の整理役
- 選択肢は常に3つ（ADR-010: output-errorで再生成）
- 1回の応答は3-4文以内
- 質問は1つだけ
- 感情の断定禁止

## Tool実装ルール
- toolCall.input が正（args/parametersは存在しない — ADR-013）
- present_choicesは .length(3) をZodで強制
- パース失敗時は addToolOutput({ state: "output-error", errorText }) で再生成

## 危機ゲート（ADR-011）
- plain text ResponseでOK（SSE不要）
- AIChatAgentが自動でtext-start/delta/endに変換する
- Response.bodyは必ず持たせる（nullだと空メッセージ）

## ブラックリスト5項目
1. 診断の断定（「あなたはうつ病です」）
2. 処方の指示（「薬を飲んでください」）
3. 自傷への言及（方法・手段の提供）
4. 他者攻撃の正当化（「上司が悪い」）
5. 感情の断定（「あなたは怒っています」）

## 参照ドキュメント
- Linear GuChillプロジェクト: 00全体像〜06検証済みナレッジ
- ADR-001〜013
- 06-verified-knowledge: API確認済み情報・罠一覧
