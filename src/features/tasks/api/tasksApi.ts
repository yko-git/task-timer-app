/**
    ・APIクライアント: タスク関連のAPI呼び出しを管理（最も内側）
    ・HTTP通信だけを担当し、ビジネスロジックは含まない
    ・エラーハンドリングもここで行う
    ・型を厳密に定義し、APIレスポンスの型安全性を確保
*/
import { Task, CreateTaskDto, UpdateTaskDto } from '../../../shared/types'

const API_BASE_URL = '/api/tasks'

// タスク一覧を取得
export const fetchTasks = async (): Promise<Task[]> => {
  // fetchはPromiseを返すのでasync/awaitを使用
  const response = await fetch(API_BASE_URL)

  // HTTPステータスコードが成功しているか確認
  if (!response.ok) {
    throw new Error('タスクの取得に失敗しました')
  }

  return response.json()
}

/**
 * タスクを作成
 */
export const createTask = async (dto: CreateTaskDto): Promise<Task> => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  })
  if (!response.ok) {
    throw new Error('タスクの作成に失敗しました')
  }
  //   オブジェクトをJSON文字列に変換して送信
  return response.json()
}

/**
 * タスクを更新
 */
export const updateTask = async (id: string, dto: UpdateTaskDto): Promise<Task> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  })
  if (!response.ok) {
    throw new Error('タスクの更新に失敗しました')
  }
  //   オブジェクトをJSON文字列に変換して送信
  return response.json()
}

/**
 * タスクを削除
 */
// 返すデータがないのでvoid型
export const deleteTask = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('タスクの削除に失敗しました')
  }
}
