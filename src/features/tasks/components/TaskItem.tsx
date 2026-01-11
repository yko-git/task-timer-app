import { Task, UpdateTaskDto, Priority } from '@/shared/types'
import { useState } from 'react'

interface TaskItemProps {
  task: Task
  onUpdate: (id: string, dto: UpdateTaskDto) => Promise<void>
  onDelete: (id: string) => Promise<void>
  isActive: boolean
  onSelect: (taskId: string) => void
}

// 優先度ラベル
const getPriorityLabel = (priority?: Priority): string => {
  if (priority === 'high') return '高'
  if (priority === 'medium') return '中'
  if (priority === 'low') return '低'
  return ''
}

// 優先度の色
const getPriorityColor = (priority?: Priority): string => {
  if (priority === 'high') return '#dc3545'
  if (priority === 'medium') return '#ffc107'
  if (priority === 'low') return '#28a745'
  return ''
}

export const TaskItem = ({ task, onUpdate, onDelete, isActive, onSelect }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false) // 編集中かどうか
  const [editedTitle, setEditedTitle] = useState(task.title) // 編集中のタイトルを一時保存
  const [editedPriority, setEditedPriority] = useState(task.priority) // 編集中の優先度を一時保存

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
      {isEditing ? (
        <>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          <select
            value={editedPriority || ''}
            onChange={(e) => setEditedPriority(e.target.value as Priority | undefined)}
            onClick={(e) => e.stopPropagation()}
            style={{ marginLeft: '8px' }}
          >
            <option value="">なし</option>
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
          <button
            style={{ marginLeft: '8px', color: 'red' }}
            onClick={(e) => {
              e.stopPropagation()
              onUpdate(task.id, { title: editedTitle, priority: editedPriority })
              setIsEditing(false)
            }}
          >
            保存
          </button>
          <button
            style={{ marginLeft: '8px', color: 'red' }}
            onClick={(e) => {
              e.stopPropagation()
              setEditedTitle(task.title)
              setEditedPriority(task.priority)
              setIsEditing(false)
            }}
          >
            キャンセル
          </button>
        </>
      ) : (
        <>
          <span
            style={{
              marginLeft: '8px',
              textDecoration: task.completed ? 'line-through' : 'none',
              fontWeight: isActive ? 'bold' : 'normal',
            }}
          >
            {task.title}
          </span>

          {task.priority && (
            <span
              style={{
                marginLeft: '8px',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                color: 'white',
                backgroundColor: getPriorityColor(task.priority),
              }}
            >
              {getPriorityLabel(task.priority)}
            </span>
          )}
          <button
            style={{ marginLeft: '8px', color: 'red' }}
            onClick={(e) => {
              e.stopPropagation()
              setIsEditing(true)
            }}
          >
            編集
          </button>
          <button
            style={{ marginLeft: '8px', color: 'red' }}
            onClick={(e) => {
              e.stopPropagation()
              handleDelete()
            }}
          >
            削除
          </button>
        </>
      )}
    </li>
  )
}
