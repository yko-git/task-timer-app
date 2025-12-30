import { TimerStatus } from '@/shared/types'

interface TimerControlsProps {
  status: TimerStatus
  onStart: () => void
  onPause: () => void
  onReset: () => void
}

export const TimerControls = ({ status, onStart, onPause, onReset }: TimerControlsProps) => {
  return (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
      {status === 'running' ? (
        <button
          onClick={onPause}
          style={{ padding: '12px 24px', fontSize: '16px', cursor: 'pointer' }}
        >
          停止
        </button>
      ) : (
        <button
          onClick={onStart}
          style={{ padding: '12px 24px', fontSize: '16px', cursor: 'pointer' }}
        >
          {status === 'paused' ? '再開' : '開始'}
        </button>
      )}
      <button
        onClick={onReset}
        style={{ padding: '12px 24px', fontSize: '16px', cursor: 'pointer' }}
      >
        リセット
      </button>
    </div>
  )
}
