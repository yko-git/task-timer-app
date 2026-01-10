import { useState } from 'react'
import { CreateTaskDto, Priority } from '@/shared/types'

interface TaskFormProps {
  onAdd: (dto: CreateTaskDto) => Promise<void>
}

export const TaskForm = ({ onAdd }: TaskFormProps) => {
  const [title, setTitle] = useState<string>('')
  const [priority, setPriority] = useState<Priority | undefined>(undefined)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    // 引数に入る予定の関数（addTask）が async 関数（非同期）だから、await で待つ
    // await をつけないとaddTaskの完了を待たずに次の行に進んでしまう
    await onAdd({ title, priority, completed: false })
    setTitle('')
    setPriority(undefined)
  }
  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '16px' }}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="新しいタスクを入力..."
        style={{ padding: '8px', width: '300px' }}
      />
      <select
        value={priority || ''}
        onChange={(e) => {
          const value = e.target.value
          setPriority(value === '' ? undefined : (value as Priority))
        }}
        onClick={(e) => e.stopPropagation()}
        style={{ marginLeft: '8px' }}
      >
        <option value="">なし</option>
        <option value="high">高</option>
        <option value="medium">中</option>
        <option value="low">低</option>
      </select>
      <button type="submit" style={{ marginLeft: '8px', padding: '8px 16px' }}>
        追加
      </button>
    </form>
  )
}
