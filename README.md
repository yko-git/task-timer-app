# Task Timer App

ポモドーロタイマーとタスク管理を統合したアプリケーション

## 概要

このアプリケーションは、Feature-based Architectureを採用し、タスク管理とポモドーロタイマーを統合したWebアプリです。React + TypeScript + MSWで構築されており、設計の明確性と保守性を重視しています。

## 使用技術

- **フロントエンド**: React 18, TypeScript
- **ビルドツール**: Vite
- **モック**: MSW (Mock Service Worker)
- **テスト**: Vitest, Testing Library
- **状態管理**: React Hooks (useState, useCallback, useMemo)

---

## 設計思想

### 1. Feature-based Architecture採用理由

**採用理由**

機能ごとにコードを整理することで、以下のメリットを実現：

- **拡張性**:　新機能追加時に既存コードへの影響を最小化
- **保守性**:　関連するコードが同じディレクトリに集約され、変更箇所が明確
- **チーム開発**:　機能単位で並行開発が可能

```
src/features/
├── tasks/           # タスク管理機能
│   ├── api/        # API通信
│   ├── models/     # ビジネスロジック
│   ├── hooks/      # カスタムフック
│   └── components/ # UI
└── timer/          # タイマー機能
    ├── models/
    ├── hooks/
    └── components/
```

各機能が独立しており、`tasks`機能の変更が`timer`機能に影響しない設計。

**効果**

- 新しいタスク機能を追加する際、`tasks/`ディレクトリ内だけで完結
- 機能削除時も該当ディレクトリを削除するだけで対応可能
- コードレビュー時に変更範囲が明確

### 2. 依存方向の徹底（UI → hooks → model → api）

**設計方針**

依存方向を「外側（UI）→ 内側（api/model）」に統一することで、変更の影響を最小化。

- **UI層（デザイン）**: 頻繁に変更される
- **ビジネスロジック層（計算式）**: 安定している

逆方向の依存（内側 → 外側）を許すと、UIを変えるたびにビジネスロジックの修正が必要になり、影響範囲が広がる。

**実装例**

各層は下の層のみに依存し、上の層を知らない：

```
TaskList (UI)
  ↓ 使う
useTasks (hooks)
  ↓ 使う
tasksApi (api)
  ↓ 使う
Task型、バリデーション (model)
```

具体的には：

- `TaskList` は `useTasks` を呼び出すが、`tasksApi` を直接知らない
- `useTasks` は `tasksApi` を呼び出すが、`TaskList` を知らない
- `tasksApi` は `Task` 型を使うが、hooks を知らない

**効果**

- **変更の局所化**: UI変更時、hooks層以下は影響を受けない
- **再利用性**: hooks や model は他のコンポーネントでも使える
- **テスト容易性**: 各層を独立してテストできる

### 3. useMemo/useCallbackによるパフォーマンス最適化

### 4. カスタムフックによる関心の分離

### 5. 責務の明確化と単一責任の原則

---

## フォルダ構造

---

## セットアップ

---

## 技術的なハイライト
