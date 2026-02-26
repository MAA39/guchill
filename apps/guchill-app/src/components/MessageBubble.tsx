import type { UIMessage } from "ai";

type Props = {
  message: UIMessage;
  onChoiceSelect?: (toolCallId: string, choiceId: string, label: string) => void;
};

type ChoiceArg = { id: string; label: string };

export function MessageBubble({ message, onChoiceSelect }: Props) {
  const isUser = message.role === "user";

  // テキスト部分
  const textParts = message.parts
    ?.filter((p) => p.type === "text")
    .map((p) => (p as { type: "text"; text: string }).text)
    .join("") ?? "";

  // present_choices tool parts を検出 (AI SDK v6: type = "tool-present_choices")
  const choiceParts = (message.parts ?? []).filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (p: any) => p.type === "tool-present_choices"
  );

  const hasContent = textParts || choiceParts.length > 0;
  if (!hasContent) return null;

  return (
    <div>
      {/* テキスト部分 */}
      {textParts && (
        <div style={{
          display: "flex",
          justifyContent: isUser ? "flex-end" : "flex-start",
          margin: "6px 0",
        }}>
          <div style={{
            maxWidth: "80%",
            padding: "10px 14px",
            borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
            backgroundColor: isUser ? "#9b7ec5" : "#f3f0f7",
            color: isUser ? "#fff" : "#333",
            fontSize: 15,
            lineHeight: 1.5,
            wordBreak: "break-word",
          }}>
            {textParts}
          </div>
        </div>
      )}

      {/* 3択ボタン */}
      {choiceParts.map((cp: any) => {
        const toolCallId = cp.toolCallId as string;
        const state = cp.state as string;
        const args = (cp.input ?? {}) as Record<string, unknown>;
        const title = (args.title as string) ?? "";
        const choices = (args.choices as ChoiceArg[]) ?? [];
        const isAnswered = state === "output-available" || state === "output-error";

        return (
          <div key={toolCallId} style={{ margin: "8px 0", paddingLeft: 4 }}>
            {title && (
              <div style={{
                fontSize: 14,
                color: "#666",
                marginBottom: 8,
              }}>
                {title}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {choices.map((c) => (
                <button
                  key={c.id}
                  disabled={isAnswered}
                  onClick={() => onChoiceSelect?.(toolCallId, c.id, c.label)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 12,
                    border: "1.5px solid #9b7ec5",
                    backgroundColor: isAnswered ? "#f3f0f7" : "#fff",
                    color: isAnswered ? "#999" : "#7b5ea5",
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: isAnswered ? "default" : "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
