import { useEffect, useState } from 'react'

interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: string
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // タスク一覧を取得
    fetch('/api/tasks')
      .then((res) => res.json())
      .then((data) => {
        setTasks(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Task Timer App - MSW テスト</h1>
      <h2>タスク一覧</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <input type="checkbox" checked={task.completed} readOnly />
            {task.title}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
