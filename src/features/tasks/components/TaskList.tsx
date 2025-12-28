import { useTasks } from '../hooks/useTasks'
import { TaskForm } from './TaskForm'
import { TaskItem } from './TaskItem'

export const TaskList = () => {
  // useTasksカスタムフックから必要な各プロパティを取り出す
  const { tasks, isLoading, error, addTask, updateTask, deleteTask } = useTasks()
  if (isLoading) return <div>読み込み中...</div>

  if (error) return <div>エラー: {error}</div>

  return (
    <div style={{ padding: '20px' }}>
      <h1>タスク一覧</h1>
      <TaskForm onAdd={addTask} />

      {tasks.length === 0 ? (
        <p>タスクがありません。上のフォームから追加してください。</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} />
          ))}
        </ul>
      )}
    </div>
  )
}
