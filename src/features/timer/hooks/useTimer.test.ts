import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useTimer } from './useTimer'
import { act } from 'react'

describe('useTimer', () => {
  // 初期状態が正しい
  it('初期状態でタスクを取得できる', async () => {
    const { result } = renderHook(() => useTimer())

    // 初期状態の確認
    expect(result.current.timerState.status).toBe('idle')
    expect(result.current.timerState.remainingSeconds).toBe(1500) // 25分
    expect(result.current.timerState.isBreak).toBe(false)
  })

  // タイマーの開始と進行
  it('タイマーが正常に開始される', async () => {
    const { result } = renderHook(() => useTimer())

    // タイマーを開始
    act(() => {
      result.current.start()
    })
    expect(result.current.timerState.status).toBe('running')
  })

  // 停止機能が正常に動作する
  it('停止機能が正常に動作する', async () => {
    const { result } = renderHook(() => useTimer())

    // start してから pause
    act(() => {
      result.current.start()
    })
    act(() => {
      result.current.pause()
    })
    expect(result.current.timerState.status).toBe('paused')
  })

  // リセット機能が正常に動作する
  it('リセット機能が正常に動作する', async () => {
    const { result } = renderHook(() => useTimer())

    // start してから reset
    act(() => {
      result.current.start()
    })
    act(() => {
      result.current.reset()
    })
    expect(result.current.timerState.status).toBe('idle')
    expect(result.current.timerState.remainingSeconds).toBe(1500)
  })
})
