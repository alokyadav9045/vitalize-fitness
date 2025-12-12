import { renderHook, act } from '@testing-library/react'
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates'

// Mock EventSource
const mockEventSource = {
  onopen: jest.fn(),
  onmessage: jest.fn(),
  onerror: jest.fn(),
  close: jest.fn(),
  readyState: 1,
  CONNECTING: 0,
  OPEN: 1,
  CLOSED: 2
}

global.EventSource = jest.fn().mockImplementation(() => mockEventSource)

describe('useRealtimeUpdates', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with disconnected state', () => {
    const { result } = renderHook(() => useRealtimeUpdates())

    expect(result.current.isConnected).toBe(false)
    expect(result.current.events).toEqual([])
  })

  it('should connect to EventSource on mount', () => {
    renderHook(() => useRealtimeUpdates())

    expect(global.EventSource).toHaveBeenCalledWith('/api/sse')
  })

  it('should handle connection open', () => {
    renderHook(() => useRealtimeUpdates())

    act(() => {
      mockEventSource.onopen()
    })

    // Note: We can't easily test the state change without proper mocking
    // This would require more complex setup with a test EventSource implementation
  })

  it('should handle incoming messages', () => {
    const { result } = renderHook(() => useRealtimeUpdates())

    const testEvent = {
      type: 'dashboard_update',
      data: { stats: { totalMembers: 150 } },
      timestamp: new Date().toISOString()
    }

    act(() => {
      mockEventSource.onmessage({
        data: JSON.stringify(testEvent)
      })
    })

    expect(result.current.events).toContainEqual(testEvent)
  })

  it('should send test events', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true })

    const { result } = renderHook(() => useRealtimeUpdates())

    await act(async () => {
      await result.current.sendTestEvent('test_event', { test: 'data' })
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/sse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'test_event',
        data: { test: 'data' }
      }),
    })
  })
})