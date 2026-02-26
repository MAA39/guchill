import { useState, useRef, useEffect } from "react";
import { useAgent } from "agents/react";
import { useAgentChat } from "@cloudflare/ai-chat/react";
import { MessageBubble } from "./MessageBubble";
import { authClient } from "../lib/auth-client";
import type { UIMessage } from "ai";

export function ChatView({ onLogout }: { onLogout: () => void }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Step 1: WebSocket 接続を確立
  const agent = useAgent({
    agent: "guchill-agent",
    basePath: "agent",
  });

  // Step 2: チャット機能をフックで取得
  const {
    messages,
    sendMessage,
    status,
    clearHistory,
  } = useAgentChat({
    agent,
    // Day 2: echo 段階では復元不要。null で初期fetchをスキップ。
    getInitialMessages: null,
  });

  const isStreaming = status === "streaming";

  // メッセージ追加時にスクロール
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput("");
    sendMessage({ text });
  };

  return (
    <div style={{
      maxWidth: 480,
      margin: "0 auto",
      padding: 16,
      height: "100dvh",
      display: "flex",
      flexDirection: "column",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      {/* ヘッダー */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: 12,
        borderBottom: "1px solid #e5e5e5",
        marginBottom: 12,
      }}>
        <h1 style={{
          color: "#9b7ec5",
          fontSize: 20,
          fontWeight: 700,
          margin: 0,
        }}>
          🧘 GuChill
        </h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={clearHistory}
            style={{
              background: "none",
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: "4px 10px",
              fontSize: 13,
              color: "#888",
              cursor: "pointer",
            }}
          >
            クリア
          </button>
          <button
            onClick={async () => {
              await authClient.signOut();
              onLogout();
            }}
            style={{
              background: "none",
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: "4px 10px",
              fontSize: 13,
              color: "#e74c3c",
              cursor: "pointer",
            }}
          >
            ログアウト
          </button>
        </div>
      </div>

      {/* メッセージ一覧 */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        paddingBottom: 12,
      }}>
        {messages.length === 0 && (
          <div style={{
            textAlign: "center",
            color: "#aaa",
            marginTop: 80,
            fontSize: 14,
          }}>
            何があった？話してみて 💬
          </div>
        )}
        {messages.map((msg: UIMessage) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* 入力フォーム */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        style={{
          display: "flex",
          gap: 8,
          paddingTop: 12,
          borderTop: "1px solid #e5e5e5",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="何があった？"
          disabled={isStreaming}
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid #ddd",
            fontSize: 15,
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={isStreaming || !input.trim()}
          style={{
            padding: "10px 18px",
            borderRadius: 12,
            border: "none",
            backgroundColor: isStreaming || !input.trim() ? "#d5c8e6" : "#9b7ec5",
            color: "white",
            fontSize: 15,
            fontWeight: 600,
            cursor: isStreaming || !input.trim() ? "default" : "pointer",
          }}
        >
          送信
        </button>
      </form>
    </div>
  );
}
