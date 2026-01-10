# Task Timer App

ポモドーロタイマーとタスク管理を統合したアプリケーション

**デモ:** https://task-timer-app-seven.vercel.app/

## 概要

このアプリケーションは、Feature-based Architectureを採用し、タスク管理とポモドーロタイマーを統合したWebアプリです。React + TypeScript + MSWで構築されており、設計の明確性と保守性を重視しています。

## 主な機能

### タスク管理

- ✅ タスクの追加・削除・完了
- ✅ タスクの編集
- ✅ タスクの優先度設定（高・中・低）
- ✅ 優先度順の自動ソート
- ✅ フィルター機能（全て/未完了/完了）
- ✅ 統計表示（完了率、タスク数）

### ポモドーロタイマー

- ✅ 25分作業 / 5分休憩の自動切り替え
- ✅ タイマーの開始・停止・リセット
- ✅ 進捗バーによる視覚的フィードバック

### 統合機能

- ✅ タスク選択でタイマー自動起動
- ✅ 実行中タスクの強調表示
- ✅ タイマーに実行中タスク名を表示

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

**設計方針**

単一責任の原則：1つのモジュールは1つの責務のみを持つべき。

責務を分離することで：

- 変更箇所が明確になり、修正が容易
- 読む範囲が限定され、理解しやすい
- 変更の影響をモジュール内に閉じ込められる

**各層の責務**

| 層          | 責務                                                 | やらないこと                        |
| ----------- | ---------------------------------------------------- | ----------------------------------- |
| **UI層**    | UIを表示し、ユーザー操作を受け取る                   | ビジネスロジック、状態管理、API通信 |
| **Hooks層** | 状態管理とビジネスロジック                           | UI表示、API通信の実装詳細           |
| **Model層** | 型定義、バリデーション、データ変換・計算（純粋関数） | 状態管理、API通信、UI表示           |
| **API層**   | HTTP通信、エラーハンドリング                         | 状態管理、ビジネスロジック、UI表示  |

**具体例：TaskItem コンポーネント**

```typescript
export const TaskItem = ({ task, onUpdate, onDelete, isActive, onSelect }) => {
  const handleToggle = () => onUpdate(task.id, { completed: !task.completed })
  const handleDelete = () => { /* ... */ }
  const handleSelect = () => onSelect(task.id)

  return (
    <li onClick={handleSelect}>
      <input type="checkbox" onChange={handleToggle} />
      <span>{task.title}</span>
      <button onClick={handleDelete}>削除</button>
    </li>
  )
}
```

**TaskItem の責務：**

- props を受け取り、タスクを表示する（UI層としての責務）
- ユーザー操作を受け付け、親コンポーネントに伝える（イベントハンドリング）
- 完了状態に応じてスタイルを変化させる（表示ロジック）

**TaskItem がやらないこと：**

- タスクの更新・削除処理の実装（親から受け取った関数を呼ぶだけ）
- API通信（hooks層に委譲）
- 状態管理（親コンポーネントが管理）

これにより、TaskItem は「1つのタスクを表示する」という単一の責務に集中できる。

**効果**

- コンポーネントが小さく、理解しやすい（30-50行程度）
- 各層を独立して修正・テスト可能
- バグの影響範囲が限定される

## フォルダ構造

```
src/
├── features/              # 機能ごとに整理
│   ├── tasks/            # タスク管理機能
│   │   ├── api/          # API通信層
│   │   │   └── tasksApi.ts
│   │   ├── models/       # ビジネスロジック・型定義
│   │   │   └── task.ts
│   │   ├── hooks/        # カスタムフック
│   │   │   └── useTasks.ts
│   │   └── components/   # UI層
│   │       ├── TaskList.tsx
│   │       ├── TaskItem.tsx
│   │       └── TaskForm.tsx
│   │
│   └── timer/            # タイマー機能
│       ├── models/
│       │   └── timer.ts
│       ├── hooks/
│       │   └── useTimer.ts
│       └── components/
│           ├── TimerDisplay.tsx
│           └── TimerControls.tsx
│
├── shared/               # 共通モジュール
│   ├── types/           # 共通型定義
│   │   └── index.ts
│   └── utils/           # ユーティリティ関数
│       └── format.ts
│
├── mocks/               # MSW設定
│   ├── handlers.ts     # APIモックハンドラー
│   ├── browser.ts      # ブラウザ用設定
│   ├── server.ts       # テスト用設定
│   └── data.ts         # モックデータ
│
└── test/               # テスト設定
    └── setup.ts
```

**特徴**

- 機能ごとに完全に分離（tasks, timer）
- 各機能内で依存方向を徹底（api → model → hooks → components）
- 共通コードは shared に集約

---

## セットアップ

### 必要な環境

- Node.js 18以上
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd task-timer-app

# 依存関係をインストール
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開く

### その他のコマンド

```bash
# ビルド
npm run build

# リント
npm run lint

# フォーマット
npm run format

# テスト
npm test
```

---

## 技術的なハイライト

### useMemo/useCallback の使用箇所

**useMemo（4箇所）**

```typescript
// 1. フィルタリング済みタスクリスト
const filteredTasks = useMemo(() => filterTasks(tasks, filter), [tasks, filter])

// 2. タスク統計の計算
const stats = useMemo(() => getTaskStats(tasks), [tasks])

// 3. タイマー表示フォーマット
const formattedTime = useMemo(
  () => formatTime(timerState.remainingSeconds),
  [timerState.remainingSeconds]
)

// 4. タイマー進捗率の計算
const progress = useMemo(
  () => calculateProgress(timerState.remainingSeconds, timerState.totalSeconds),
  [timerState.remainingSeconds, timerState.totalSeconds]
)
```

**useCallback（7箇所）**

タスク操作（3箇所）：

- `addTask` - タスク追加
- `updateTask` - タスク更新
- `deleteTask` - タスク削除

タイマー操作（4箇所）：

- `start` - タイマー開始
- `pause` - タイマー停止
- `reset` - タイマーリセット
- `advanceSession` - 次のセッションへ

### State Lifting（状態の巻き上げ）

タスクとタイマーの連携のため、App.tsx で両方の状態を管理：

```typescript
function App() {
  const tasksData = useTasks()
  const timerData = useTimer()
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)

  // タスク選択時にタイマー自動起動
  const handleSelectTask = (taskId: string) => {
    setActiveTaskId(taskId)
    if (timerData.timerState.status === 'idle') {
      timerData.start()
    }
  }

  return (
    <>
      <TimerDisplay {...timerData} activeTask={activeTask} />
      <TaskList {...tasksData} onSelectTask={handleSelectTask} />
    </>
  )
}
```

### MSW によるモックAPI

バックエンドなしで開発・テストが可能：

```typescript
// handlers.ts
export const handlers = [
  http.get('/api/tasks', () => {
    const tasks = getTasks() // LocalStorageから取得
    return HttpResponse.json(tasks)
  }),

  http.post('/api/tasks', async ({ request }) => {
    const body = await request.json()
    const newTask = { id: generateId(), ...body }
    saveTasks([...getTasks(), newTask])
    return HttpResponse.json(newTask, { status: 201 })
  }),
]
```

LocalStorageと連携することで、リロード後もデータが永続化される。

### テスト戦略

カスタムフックの単体テストを実装：

```typescript
it('タスクを追加できる', async () => {
  const { result } = renderHook(() => useTasks())

  await waitFor(() => {
    expect(result.current.isLoading).toBe(false)
  })

  await result.current.addTask({ title: 'テスト用タスク', completed: false })

  await waitFor(() => {
    expect(result.current.tasks).toContainEqual(
      expect.objectContaining({ title: 'テスト用タスク' })
    )
  })
})
```

MSWのテスト用サーバーと連携し、実際のAPI呼び出しに近い形でテスト。

### タスク編集機能の実装

インライン編集による直感的なUI：

```typescript
export const TaskItem = ({ task, onUpdate, ... }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)

  return (
    <li>
      {isEditing ? (
        <>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onClick={(e) => e.stopPropagation()}  // イベント伝播を防ぐ
          />
          <button onClick={handleSave}>保存</button>
          <button onClick={handleCancel}>キャンセル</button>
        </>
      ) : (
        <>
          <span>{task.title}</span>
          <button onClick={() => setIsEditing(true)}>編集</button>
        </>
      )}
    </li>
  )
}
```

**設計のポイント：**

- ローカルな状態は TaskItem 内で管理
- 既存の `onUpdate` 関数を再利用
- `stopPropagation` でイベント競合を回避

### タスクの優先度機能

優先度（高・中・低）による自動ソート：

**Model層でのソートロジック：**

```typescript
// 優先度を数値に変換
const getPriorityValue = (priority?: Priority): number => {
  if (priority === 'high') return 1
  if (priority === 'medium') return 2
  if (priority === 'low') return 3
  return 999 // 優先度なしは最後
}

// 優先度順にソート
export const sortByPriority = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    const aValue = getPriorityValue(a.priority)
    const bValue = getPriorityValue(b.priority)
    return aValue - bValue
  })
}
```

**UI層での活用：**

```typescript
// TaskList.tsx
const filteredTasks = useMemo(() => sortByPriority(filterTasks(tasks, filter)), [tasks, filter])
```

フィルター後に優先度順でソートすることで、常に整理された状態を保持。

**設計のポイント：**

- 純粋関数によるソートロジック（Model層）
- useMemo による最適化
- 色分けバッジによる視覚的フィードバック（赤・黄・緑）
- TaskForm と TaskItem の両方で優先度を設定可能

# 学んだこと

- Feature-based Architecture
- クリーンアーキテクチャの依存方向
- カスタムフックによる関心の分離
- パフォーマンス最適化（useMemo/useCallback）
- 責務の明確化
- State Lifting
- MSW によるモック開発
- Vitestでのテスト
