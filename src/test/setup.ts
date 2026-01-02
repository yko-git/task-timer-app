import { expect, afterEach, beforeAll, afterAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import { server } from '../mocks/server'

expect.extend(matchers)

// MSWサーバーをテスト前に起動
beforeAll(() => server.listen())

// 各テスト後にクリーンアップ
afterEach(() => {
  cleanup()
  server.resetHandlers()
})

// テスト終了後にMSWサーバーを停止
afterAll(() => server.close())
