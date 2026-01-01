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

  // 実行中のタスクを取得
  const activeTask = activeTaskId ? tasksData.tasks.find((task) => task.id === activeTaskId) : null

  // タスク選択時の処理
  const handleSelectTask = (taskId: string) => {
    setActiveTaskId(taskId)
    // タイマーが停止中なら自動で開始
    if (timerData.timerState.status === 'idle') {
      timerData.start()
    }
  }

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
          activeTask={activeTask}
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
          activeTaskId={activeTaskId}
          onSelectTask={handleSelectTask}
        />
      </div>
    </div>
  )
}

export default App
