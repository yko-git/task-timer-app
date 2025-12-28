import { useState, useEffect, useCallback } from 'react'
import { Task, CreateTaskDto, UpdateTaskDto } from '../../../shared/types/index.ts'
import * as tasksApi from '../api/tasksApi.ts'

export const useTasks = () => {
  // 1.状態管理
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 2.初回データ取得
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await tasksApi.fetchTasks()
        setTasks(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '不明なエラーが発生しました')
      } finally {
        setIsLoading(false)
      }
    }
    loadTasks()
  }, [])

  //   タスクの追加
  const addTask = useCallback(async (dto: CreateTaskDto) => {
    try {
      const newTask = await tasksApi.createTask(dto)
      setTasks((prevTasks) => [...prevTasks, newTask])
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました')
      throw err
    }
  }, []) // 関数内で外部変数を参照しないので依存配列は空・setTasksが関数形式なので問題なし

  //   タスクの更新
  const updateTask = useCallback(async (id: string, dto: UpdateTaskDto) => {
    try {
      const updateTask = await tasksApi.updateTask(id, dto)
      setTasks((prevTasks) => prevTasks.map((task) => (task.id === id ? updateTask : task)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'タスクの更新に失敗しました')
      throw err
    }
  }, []) // 関数内で外部変数を参照しないので依存配列は空・setTasksが関数形式なので問題なし

  //   タスクの削除
  const deleteTask = useCallback(async (id: string) => {
    try {
      await tasksApi.deleteTask(id)
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'タスクの削除に失敗しました')
      throw err
    }
  }, []) // 関数内で外部変数を参照しないので依存配列は空・setTasksが関数形式なので問題なし

  return {
    tasks,
    isLoading,
    error,
    addTask,
    updateTask,
    deleteTask,
  }
}
