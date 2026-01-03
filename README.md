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

**最適化の方針**

関数・値をReactのメモリに保存することで、親コンポーネントが再レンダリングされた時の不要な再計算・再レンダリングを削減。

**useMemo の使用例：filteredTasks**

```typescript
const filteredTasks = useMemo(() => filterTasks(tasks, filter), [tasks, filter])
```

`filterTasks` は配列をループして絞り込む処理であり、タスク数が多いと計算コストが高い。

- **再計算が必要**: `tasks` または `filter` が変わった時のみ
- **再計算が不要**: それ以外の再レンダリング（例：統計表示の開閉）

useMemo により、依存配列 `[tasks, filter]` が変わらない限り、前回の計算結果を再利用。

**useCallback の使用例：addTask**

```typescript
const addTask = useCallback(async (dto: CreateTaskDto) => {
  const newTask = await tasksApi.createTask(dto)
  setTasks((prevTasks) => [...prevTasks, newTask])
}, [])
```

この関数は子コンポーネント（TaskForm）に props として渡される。

- **useCallback なし**: 親が再レンダリングされるたびに新しい関数が生成され、子も再レンダリング
- **useCallback あり**: 同じ関数オブジェクトを保持し、子の不要な再レンダリングを防ぐ

依存配列が `[]` なのは、関数形式の `setState` を使用しているため、外部変数に依存していないから。

**最適化の効果**

- useMemo: 4箇所（filteredTasks, stats, formattedTime, progress）
- useCallback: 7箇所（addTask, updateTask, deleteTask, start, pause, reset, advanceSession）

タスク数が100件を超えるような場合でも、スムーズな操作感を維持。

### 4. カスタムフックによる関心の分離

**設計方針**

状態管理とビジネスロジックをカスタムフックに切り出すことで、コンポーネント間でロジックを共有し、コードの重複を削減。

**実装例**

**useTasks の責務：**

```typescript
const { tasks, isLoading, error, addTask, updateTask, deleteTask } = useTasks()
```

- タスクの状態管理（tasks, isLoading, error）
- CRUD操作の提供（addTask, updateTask, deleteTask）
- API通信の詳細を隠蔽

コンポーネントは「タスクを追加する」という操作だけを知り、API呼び出しの詳細は知らなくて良い。

**useTimer の責務：**

```typescript
const { timerState, start, pause, reset, advanceSession } = useTimer()
```

- タイマーの状態管理（timerState, intervalRef）
- タイマー制御の提供（start, pause, reset）
- setInterval による時間管理ロジックを隠蔽

**カスタムフックを使わない場合の問題**

```typescript
// ❌ カスタムフックなしの例
function TaskList() {
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 50行のAPI呼び出しロジック...
  }, [])

  const addTask = async () => {
    // 30行の追加ロジック...
  }

  // UIとロジックが混在し、200行超のコンポーネントに...
}
```

問題点：

- ロジックとUIが混在して読みにくい
- コンポーネントが肥大化（200行超）
- 他のコンポーネントで再利用できない
- ロジック部分だけをテストできない

**効果**

- コンポーネントは30-50行程度に抑えられ、UIに集中
- ロジックは独立してテスト可能
- 複数のコンポーネントで同じロジックを再利用

### 5. 責務の明確化と単一責任の原則

---

## フォルダ構造

---

## セットアップ

---

## 技術的なハイライト
