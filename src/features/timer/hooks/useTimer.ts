import { useState, useRef, useCallback, useEffect } from 'react'
import { TimerState, TimerConfig } from '@/shared/types'
import { DEFAULT_TIMER_CONFIG } from '../models/timer'
import * as timerModel from '../models/timer'

export const useTimer = () => {
  const [timerState, setTimerState] = useState<TimerState>(timerModel.createInitialTimerState())
  const [config] = useState<TimerConfig>(DEFAULT_TIMER_CONFIG)
  const intervalRef = useRef<number | null>(null)

  const start = useCallback(() => {
    // 既にタイマーが動作中の場合は何もしない
    if (intervalRef.current !== null) return

    // ステータスを running に更新
    setTimerState((prev) => ({
      ...prev,
      status: 'running',
    }))

    // 1秒ごとに remainingSeconds を減少させる
    intervalRef.current = window.setInterval(() => {
      setTimerState((prev) => {
        const newRemainingSeconds = prev.remainingSeconds - 1

        // 時間切れチェック
        if (timerModel.isTimerCompleted(newRemainingSeconds)) {
          // タイマー停止
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }

          // 完了状態に
          return {
            ...prev,
            status: 'completed',
            remainingSeconds: 0,
          }
        }

        return {
          ...prev,
          remainingSeconds: newRemainingSeconds,
        }
      })
    }, 1000)
  }, [])

  const pause = useCallback(() => {
    // setInterval を停止
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    // ステータスを 'paused' に変更
    setTimerState((prev) => ({
      ...prev,
      status: 'paused',
    }))
  }, [])

  // リセット
  const reset = useCallback(() => {
    // setInterval を停止
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    // タイマー状態を初期化
    setTimerState(timerModel.createInitialTimerState(config))
  }, [config])

  // セッションを進める
  const advanceSession = useCallback(() => {
    const nextState = timerModel.advanceToNextSession(timerState, config)
    setTimerState(nextState)
  }, [timerState, config])

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return {
    timerState,
    config,
    start,
    pause,
    reset,
    advanceSession,
  }
}
