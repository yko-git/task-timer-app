import { Task, UpdateTaskDto } from '@/shared/types'

interface TaskItemProps {
  task: Task
  onUpdate: (id: string, dto: UpdateTaskDto) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export const TaskItem = ({ task, onUpdate, onDelete }: TaskItemProps) => {
  const handleToggle = () => {
    onUpdate(task.id, { completed: !task.completed }) // 完了状態の真偽値を反転
  }

  const handleDelete = () => {
    if (window.confirm('このタスクを削除しますか?')) {
      onDelete(task.id)
    }
  }

  return (
    <li style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
      <input type="checkbox" checked={task.completed} onChange={handleToggle} />
      <span style={{ marginLeft: '8px', textDecoration: task.completed ? 'line-through' : 'none' }}>
        {task.title}
      </span>
      <button onClick={handleDelete} style={{ marginLeft: '8px', color: 'red' }}>
        削除
      </button>
    </li>
  )
}
