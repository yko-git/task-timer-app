import { Task, UpdateTaskDto } from '@/shared/types'

interface TaskItemProps {
  task: Task
  onUpdate: (id: string, dto: UpdateTaskDto) => Promise<void>
  onDelete: (id: string) => Promise<void>
  isActive: boolean
  onSelect: (taskId: string) => void
}

export const TaskItem = ({ task, onUpdate, onDelete, isActive, onSelect }: TaskItemProps) => {
  const handleToggle = () => {
    onUpdate(task.id, { completed: !task.completed }) // 完了状態の真偽値を反転
  }

  const handleDelete = () => {
    if (window.confirm('このタスクを削除しますか?')) {
      onDelete(task.id)
    }
  }

  const handleSelect = () => {
    onSelect(task.id)
  }

  return (
    <li
      style={{
        padding: '8px',
        borderBottom: '1px solid #eee',
        backgroundColor: isActive ? '#fff3cd' : 'transparent', // ← 実行中は黄色背景
        cursor: 'pointer',
        transition: 'background-color 0.2s',
      }}
      onClick={handleSelect}
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={handleToggle}
        onClick={(e) => e.stopPropagation()} // チェックボックスのクリックが親要素に伝播しないようにする
      />
      <span
        style={{
          marginLeft: '8px',
          textDecoration: task.completed ? 'line-through' : 'none',
          fontWeight: isActive ? 'bold' : 'normal',
        }}
      >
        {task.title}
      </span>
      <button
        style={{ marginLeft: '8px', color: 'red' }}
        onClick={(e) => {
          e.stopPropagation()
          handleDelete()
        }}
      >
        削除
      </button>
    </li>
  )
}
