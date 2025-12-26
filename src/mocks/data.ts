// タスクのモックデータ

export interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: string
}

// LocalStorageのキー
const STORAGE_KEY = 'mock_tasks'

// 初期データ
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'MSWのセットアップ',
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'タスク機能の実装',
    completed: false,
    createdAt: new Date().toISOString(),
  },
]

// LocalStorageからタスクを取得
export const getTasks = (): Task[] => {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : initialTasks
}

// LocalStorageにタスクを保存
export const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

// 新しいIDを生成
export const generateId = (): string => {
  return Date.now().toString()
}
