import { useState } from 'react'
import { TaskList } from './features/tasks/components/TaskList'
import { TimerDisplay } from './features/timer/components/TimerDisplay'
import { useTasks } from './features/tasks/hooks/useTasks'
import { useTimer } from './features/timer/hooks/useTimer'

function App() {
  const tasksData = useTasks()
  const timerData = useTimer()

  // 実行中のタスクID（連携に使用）
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)

  return (
    <div style={{ display: 'flex', gap: '40px', padding: '20px' }}>
      {/* 左側：タイマー */}
      <div style={{ flex: 1 }}>
        <TimerDisplay
          timerState={timerData.timerState}
          config={timerData.config}
          start={timerData.start}
          pause={timerData.pause}
          reset={timerData.reset}
          advanceSession={timerData.advanceSession}
        />
      </div>

      {/* 右側：タスク一覧 */}
      <div style={{ flex: 1 }}>
        <TaskList
          tasks={tasksData.tasks}
          isLoading={tasksData.isLoading}
          error={tasksData.error}
          addTask={tasksData.addTask}
          updateTask={tasksData.updateTask}
          deleteTask={tasksData.deleteTask}
        />
      </div>
    </div>
  )
}

export default App
