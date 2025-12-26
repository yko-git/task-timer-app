/**
 * タイマーの状態
 */
export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed'

/**
 * タイマーの設定（分単位）
 */
export interface TimerConfig {
  workDuration: number // 作業時間（デフォルト: 25分）
  breakDuration: number // 休憩時間（デフォルト: 5分）
  longBreakDuration: number // 長い休憩（デフォルト: 15分）
  sessionsUntilLongBreak: number // 長い休憩までのセッション数（デフォルト: 4）
}

/**
 * タイマーの状態
 */
export interface TimerState {
  status: TimerStatus
  remainingSeconds: number
  totalSeconds: number
  sessionCount: number
  isBreak: boolean
}

/**
 * デフォルト設定
 */
export const DEFAULT_TIMER_CONFIG: TimerConfig = {
  workDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
}

/**
 * 初期タイマー状態を生成
 */
export const createInitialTimerState = (config: TimerConfig = DEFAULT_TIMER_CONFIG): TimerState => {
  const totalSeconds = config.workDuration * 60
  return {
    status: 'idle',
    remainingSeconds: totalSeconds,
    totalSeconds,
    sessionCount: 0,
    isBreak: false,
  }
}

/**
 * 分を秒に変換
 */
export const minutesToSeconds = (minutes: number): number => {
  return minutes * 60
}

/**
 * 秒を "MM:SS" 形式にフォーマット
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * 進捗率を計算（0-100）
 */
export const calculateProgress = (remainingSeconds: number, totalSeconds: number): number => {
  if (totalSeconds === 0) return 0
  return Math.round(((totalSeconds - remainingSeconds) / totalSeconds) * 100)
}

/**
 * 次のセッションの設定を取得
 */
export const getNextSessionDuration = (
  sessionCount: number,
  isBreak: boolean,
  config: TimerConfig
): number => {
  if (!isBreak) {
    // 作業セッション終了後 → 休憩へ
    const isLongBreak = (sessionCount + 1) % config.sessionsUntilLongBreak === 0
    return isLongBreak ? config.longBreakDuration : config.breakDuration
  } else {
    // 休憩終了後 → 作業へ
    return config.workDuration
  }
}

/**
 * タイマーを次のセッションに進める
 */
export const advanceToNextSession = (currentState: TimerState, config: TimerConfig): TimerState => {
  const nextIsBreak = !currentState.isBreak
  const nextDuration = getNextSessionDuration(
    currentState.sessionCount,
    currentState.isBreak,
    config
  )
  const nextSeconds = minutesToSeconds(nextDuration)

  return {
    status: 'idle',
    remainingSeconds: nextSeconds,
    totalSeconds: nextSeconds,
    sessionCount: nextIsBreak ? currentState.sessionCount : currentState.sessionCount + 1,
    isBreak: nextIsBreak,
  }
}

/**
 * タイマーをリセット
 */
export const resetTimer = (config: TimerConfig = DEFAULT_TIMER_CONFIG): TimerState => {
  return createInitialTimerState(config)
}

/**
 * タイマーが完了したかチェック
 */
export const isTimerCompleted = (remainingSeconds: number): boolean => {
  return remainingSeconds <= 0
}
