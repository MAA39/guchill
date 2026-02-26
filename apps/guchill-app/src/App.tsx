import { useState, useEffect } from "react";
import { authClient } from "./lib/auth-client";
import { ChatView } from "./components/ChatView";
import { AuthForm } from "./components/AuthForm";

export default function App() {
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null); // null=loading

  const checkSession = async () => {
    try {
      const session = await authClient.getSession();
      setIsAuthed(!!session?.data?.user);
    } catch {
      setIsAuthed(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  // ローディング中
  if (isAuthed === null) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100dvh",
        color: "#9b7ec5",
        fontSize: 18,
        fontFamily: "-apple-system, sans-serif",
      }}>
        🧘 読み込み中...
      </div>
    );
  }

  // 未認証
  if (!isAuthed) {
    return <AuthForm onSuccess={() => setIsAuthed(true)} />;
  }

  // 認証済み
  return <ChatView onLogout={() => setIsAuthed(false)} />;
}
