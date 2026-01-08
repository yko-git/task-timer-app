import { Task, CreateTaskDto, UpdateTaskDto, Priority } from '@/shared/types'

/**
 * タスクのバリデーション
 */
export const validateTaskTitle = (title: string): string | null => {
  if (!title || title.trim().length === 0) {
    return 'タイトルは必須です'
  }
  if (title.length > 100) {
    return 'タイトルは100文字以内で入力してください'
  }
  return null
}

/**
 * CreateTaskDto のバリデーション
 */
export const validateCreateTask = (dto: CreateTaskDto): string[] => {
  const errors: string[] = []

  const titleError = validateTaskTitle(dto.title)
  if (titleError) {
    errors.push(titleError)
  }

  return errors
}

/**
 * UpdateTaskDto のバリデーション
 */
export const validateUpdateTask = (dto: UpdateTaskDto): string[] => {
  const errors: string[] = []

  if (dto.title !== undefined) {
    const titleError = validateTaskTitle(dto.title)
    if (titleError) {
      errors.push(titleError)
    }
  }

  return errors
}

/**
 * タスクの完了状態を切り替え
 */
export const toggleTaskCompletion = (task: Task): Task => {
  return {
    ...task,
    completed: !task.completed,
  }
}

/**
 * タスクをフィルタリング
 */
export type TaskFilter = 'all' | 'active' | 'completed'

export const filterTasks = (tasks: Task[], filter: TaskFilter): Task[] => {
  switch (filter) {
    case 'active':
      return tasks.filter((task) => !task.completed)
    case 'completed':
      return tasks.filter((task) => task.completed)
    case 'all':
    default:
      return tasks
  }
}

/**
 * タスクを日付順にソート（新しい順）
 */
export const sortTasksByDate = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

/**
 * 完了率を計算
 */
export const calculateCompletionRate = (tasks: Task[]): number => {
  if (tasks.length === 0) return 0
  const completedCount = tasks.filter((task) => task.completed).length
  return Math.round((completedCount / tasks.length) * 100)
}

/**
 * タスクの統計情報
 */
export interface TaskStats {
  total: number
  completed: number
  active: number
  completionRate: number
}

export const getTaskStats = (tasks: Task[]): TaskStats => {
  const completed = tasks.filter((task) => task.completed).length
  const active = tasks.length - completed

  return {
    total: tasks.length,
    completed,
    active,
    completionRate: calculateCompletionRate(tasks),
  }
}

/**
 * タスクの優先度を数値に変換
 */
const getPriorityValue = (priority?: Priority): number => {
  if (priority === 'high') return 1
  if (priority === 'medium') return 2
  if (priority === 'low') return 3
  return 999
}

/**
 * タスクの優先度順にソート
 */
export const sortByPriority = (tasks: Task[]): Task[] => {
  return tasks.sort((a, b) => {
    const aValue = getPriorityValue(a.priority)
    const bValue = getPriorityValue(b.priority)
    return aValue - bValue
  })
}
