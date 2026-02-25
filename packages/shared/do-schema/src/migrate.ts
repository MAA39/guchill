/**
 * DO SQLite スキーマ初期化（冪等）
 * onStart() で毎回呼ぶ。CREATE TABLE IF NOT EXISTS なので安全。
 */

// DO SQLite の tagged template リテラル型
export type SqlTaggedTemplate = {
  (strings: TemplateStringsArray, ...values: unknown[]): unknown[];
};

const SCHEMA_VERSION = 1;

export function initSchema(sql: SqlTaggedTemplate): void {
  // メタテーブル
  sql`CREATE TABLE IF NOT EXISTS guchill_meta (
    key TEXT PRIMARY KEY,
    value TEXT
  )`;

  // v1: CBTテーブル群
  sql`CREATE TABLE IF NOT EXISTS cbt_sessions (
    id TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL,
    closed_at INTEGER
  )`;

  sql`CREATE TABLE IF NOT EXISTS cbt_steps (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    step_type TEXT NOT NULL,
    payload_json TEXT NOT NULL,
    created_at INTEGER NOT NULL
  )`;

  sql`CREATE TABLE IF NOT EXISTS thought_patterns (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    pattern_type TEXT NOT NULL,
    evidence_json TEXT NOT NULL,
    created_at INTEGER NOT NULL
  )`;

  // M2先行投入: セッション記憶テーブル
  sql`CREATE TABLE IF NOT EXISTS session_summaries (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    summary_text TEXT NOT NULL,
    patterns_json TEXT,
    trend_vs_previous TEXT,
    confirmed_at INTEGER,
    confirmation_status TEXT DEFAULT 'pending',
    modified_text TEXT,
    created_at INTEGER NOT NULL
  )`;

  sql`CREATE TABLE IF NOT EXISTS user_profile (
    id TEXT PRIMARY KEY,
    top_patterns_json TEXT,
    total_sessions INTEGER DEFAULT 0,
    trend_summary TEXT,
    last_updated_at INTEGER NOT NULL
  )`;

  // バージョンチェック & 更新
  const rows = sql`SELECT value FROM guchill_meta WHERE key = 'schema_version'` as { value: string }[];
  const current = Number(rows?.[0]?.value ?? 0);
  if (current < SCHEMA_VERSION) {
    sql`INSERT OR REPLACE INTO guchill_meta(key, value) VALUES ('schema_version', ${String(SCHEMA_VERSION)})`;
  }
}
