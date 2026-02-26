import type { UIMessage } from "ai";

type Props = {
  message: UIMessage;
};

export function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  // message.parts からテキストを抽出
  const text = message.parts
    ?.filter((p) => p.type === "text")
    .map((p) => (p as { type: "text"; text: string }).text)
    .join("") ?? "";

  if (!text) return null;

  return (
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
        {text}
      </div>
    </div>
  );
}
