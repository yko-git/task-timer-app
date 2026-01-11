import { useMemo, useState } from 'react'
import { Task, CreateTaskDto, UpdateTaskDto } from '@/shared/types'
import { TaskFilter, filterTasks, getTaskStats, sortByPriority } from '../models/task'
import { TaskForm } from './TaskForm'
import { TaskItem } from './TaskItem'

interface TaskListProps {
  tasks: Task[]
  isLoading: boolean
  error: string | null
  addTask: (dto: CreateTaskDto) => Promise<void>
  updateTask: (id: string, dto: UpdateTaskDto) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  activeTaskId: string | null
  onSelectTask: (taskId: string) => void
}

export const TaskList = ({
  tasks,
  isLoading,
  error,
  addTask,
  updateTask,
  deleteTask,
  activeTaskId,
  onSelectTask,
}: TaskListProps) => {
  //   フィルター状態を管理
  const [filter, setFilter] = useState<TaskFilter>('all')
  const filterdTasks = useMemo(() => sortByPriority(filterTasks(tasks, filter)), [tasks, filter])

  //   タスクの統計情報を計算
  const stats = useMemo(() => getTaskStats(tasks), [tasks])

  if (isLoading) return <div>読み込み中...</div>

  if (error) return <div>エラー: {error}</div>

  return (
    <div style={{ padding: '20px' }}>
      <h1>タスク一覧</h1>
      <TaskForm onAdd={addTask} />
      <div style={{ margin: '16px 0' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '8px 16px',
            marginRight: '8px',
            backgroundColor: filter === 'all' ? '#007bff' : '#fff',
            color: filter === 'all' ? '#fff' : '#000',
            border: '1px solid #007bff',
          }}
        >
          全て
        </button>
        <button
          onClick={() => setFilter('active')}
          style={{
            padding: '8px 16px',
            marginRight: '8px',
            backgroundColor: filter === 'active' ? '#007bff' : '#fff',
            color: filter === 'active' ? '#fff' : '#000',
            border: '1px solid #007bff',
          }}
        >
          未完了
        </button>
        <button
          onClick={() => setFilter('completed')}
          style={{
            padding: '8px 16px',
            backgroundColor: filter === 'completed' ? '#007bff' : '#fff',
            color: filter === 'completed' ? '#fff' : '#000',
            border: '1px solid #007bff',
          }}
        >
          完了
        </button>
      </div>

      <div
        style={{
          margin: '16px 0',
          padding: '16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
        }}
      >
        <h3 style={{ marginTop: 0 }}>統計</h3>
        <p>全タスク：{stats.total}件</p>
        <p>完了：{stats.completed}件</p>
        <p>未完了：{stats.active}件</p>
        <p>完了率：{stats.completionRate}%</p>
      </div>

      {filterdTasks.length === 0 ? (
        <p>タスクがありません。上のフォームから追加してください。</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filterdTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={updateTask}
              onDelete={deleteTask}
              isActive={activeTaskId === task.id}
              onSelect={onSelectTask}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
