import { useMemo } from 'react'
import { useTimer } from '../hooks/useTimer'
import { TimerControls } from './TimerControls'
import { formatTime, calculateProgress } from '../models/timer'

export const TimerDisplay = () => {
  const { timerState, start, pause, reset, advanceSession } = useTimer()

  // useMemoを使ってフォーマット済み時間を計算
  const formattedTime = useMemo(
    () => formatTime(timerState.remainingSeconds),
    [timerState.remainingSeconds]
  )

  // 進捗率を計算
  const progress = useMemo(
    () => calculateProgress(timerState.remainingSeconds, timerState.totalSeconds),
    [timerState.remainingSeconds, timerState.totalSeconds]
  )

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>ポモドーロタイマー</h2>

      {/* セッション情報 */}
      <div style={{ marginBottom: '16px', fontSize: '18px' }}>
        {timerState.isBreak ? '🌴 休憩中' : '💼 作業中'}
      </div>

      {/* 残り時間 */}
      <div style={{ fontSize: '64px', fontWeight: 'bold', marginBottom: '16px' }}>
        {formattedTime}
      </div>

      {/* 進捗バー */}
      <div
        style={{
          width: '100%',
          height: '20px',
          backgroundColor: '#e0e0e0',
          borderRadius: '10px',
          overflow: 'hidden',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: timerState.isBreak ? '#4caf50' : '#2196f3',
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      {/* セッション数 */}
      <div style={{ marginBottom: '16px', color: '#666' }}>
        セッション: {timerState.sessionCount}
      </div>

      {/* 完了メッセージ */}

      {timerState.status === 'completed' && (
        <>
          <div
            style={{
              marginBottom: '16px',
              padding: '12px',
              backgroundColor: '#e8f5e9',
              borderRadius: '4px',
              color: '#2e7d32',
            }}
          >
            🎉 {timerState.isBreak ? '休憩' : 'セッション'}完了！
          </div>
          {/* 次のセッションへボタン */}
          <button
            onClick={advanceSession}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '16px',
            }}
          >
            次のセッションへ
          </button>
        </>
      )}

      {/* 操作ボタン */}
      <TimerControls status={timerState.status} onStart={start} onPause={pause} onReset={reset} />
    </div>
  )
}
