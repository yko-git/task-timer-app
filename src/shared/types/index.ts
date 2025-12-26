// Task 関連
export interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: string
}

// Task型からidとcreatedAtを除いた型
export type CreateTaskDto = Omit<Task, 'id' | 'createdAt'>

// Task型からidを除いた型（更新用）
export type UpdateTaskDto = Partial<Omit<Task, 'id'>>

// Timer 関連
export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed'

export interface TimerConfig {
  workDuration: number
  breakDuration: number
  longBreakDuration: number
  sessionsUntilLongBreak: number
}

export interface TimerState {
  status: TimerStatus
  remainingSeconds: number
  totalSeconds: number
  sessionCount: number
  isBreak: boolean
}
