import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useTasks } from './useTasks'

describe('useTasks', () => {
  beforeEach(() => {
    // テストごとにLocalStorageをクリア
    localStorage.clear()
  })

  // useEffect でのデータ取得が正常に動作
  // MSW が正しくモックを返している
  // ローディング状態の管理
  it('初期状態でタスクを取得できる', async () => {
    const { result } = renderHook(() => useTasks())

    // 初期状態はローディング中
    expect(result.current.isLoading).toBe(true)

    // データ取得を待つ
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // MSWのモックデータが取得できている
    expect(result.current.tasks.length).toBeGreaterThan(0)
    expect(result.current.error).toBeNull()
  })

  // addTask 関数が正常に動作
  // API呼び出し後に状態が更新される
  // 追加したタスクのデータが正しい
  it('タスクを追加できる', async () => {
    const { result } = renderHook(() => useTasks())

    // データ取得を待つ
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    const initialCount = result.current.tasks.length

    // 新しいタスクを追加
    await result.current.addTask({
      title: 'テスト用タスク',
      completed: false,
    })

    // タスクが増えている
    expect(result.current.tasks.length).toBe(initialCount + 1)

    // 追加したタスクが存在する
    const addedTask = result.current.tasks.find((task) => task.title === 'テスト用タスク')
    expect(addedTask).toBeDefined()
    expect(addedTask?.completed).toBe(false)
  })
})
