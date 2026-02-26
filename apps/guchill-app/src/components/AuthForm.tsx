import { useState } from "react";
import { authClient } from "../lib/auth-client";

type Mode = "signin" | "signup";

export function AuthForm({ onSuccess }: { onSuccess: () => void }) {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("test@guchill.local");
  const [password, setPassword] = useState("testtest");
  const [name, setName] = useState("テストユーザー");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        const res = await authClient.signUp.email({
          email,
          password,
          name,
        });
        if (res.error) {
          setError(res.error.message || "サインアップ失敗");
          setLoading(false);
          return;
        }
      } else {
        const res = await authClient.signIn.email({
          email,
          password,
        });
        if (res.error) {
          setError(res.error.message || "ログイン失敗");
          setLoading(false);
          return;
        }
      }
      onSuccess();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: 400,
      margin: "80px auto",
      padding: 24,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      <h1 style={{ color: "#9b7ec5", textAlign: "center", marginBottom: 24 }}>
        🧘 GuChill
      </h1>

      <div style={{
        display: "flex",
        gap: 8,
        marginBottom: 20,
        justifyContent: "center",
      }}>
        <button
          onClick={() => setMode("signin")}
          style={{
            padding: "6px 16px",
            borderRadius: 8,
            border: mode === "signin" ? "2px solid #9b7ec5" : "1px solid #ddd",
            background: mode === "signin" ? "#f3eefa" : "white",
            color: mode === "signin" ? "#9b7ec5" : "#888",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          ログイン
        </button>
        <button
          onClick={() => setMode("signup")}
          style={{
            padding: "6px 16px",
            borderRadius: 8,
            border: mode === "signup" ? "2px solid #9b7ec5" : "1px solid #ddd",
            background: mode === "signup" ? "#f3eefa" : "white",
            color: mode === "signup" ? "#9b7ec5" : "#888",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          新規登録
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {mode === "signup" && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="名前"
            style={inputStyle}
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="メールアドレス"
          style={inputStyle}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="パスワード（8文字以上）"
          style={inputStyle}
        />

        {error && (
          <div style={{ color: "#e74c3c", fontSize: 13, textAlign: "center" }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 0",
            borderRadius: 12,
            border: "none",
            backgroundColor: loading ? "#d5c8e6" : "#9b7ec5",
            color: "white",
            fontSize: 15,
            fontWeight: 600,
            cursor: loading ? "default" : "pointer",
          }}
        >
          {loading ? "..." : mode === "signin" ? "ログイン" : "アカウント作成"}
        </button>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 12,
  border: "1px solid #ddd",
  fontSize: 15,
  outline: "none",
};
