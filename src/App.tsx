import { TaskList } from './features/tasks/components/TaskList'
import { TimerDisplay } from './features/timer/components/TimerDisplay'

function App() {
  return (
    <div style={{ display: 'flex', gap: '40px', padding: '20px' }}>
      {/* 左側タイマー */}
      <div style={{ flex: 1 }}>
        <TimerDisplay />
      </div>

      {/* 右側タイマー */}
      <div style={{ flex: 1 }}>
        <TaskList />
      </div>
    </div>
  )
}
export default App
