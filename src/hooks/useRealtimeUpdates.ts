'use client'

import { useEffect, useRef, useState } from 'react'

export type RealtimeEvent =
  | {
      type: 'dashboard_update'
      data: { stats?: { totalMembers?: number; todayCheckIns?: number; monthlyRevenue?: number; activeMemberships?: number } }
      timestamp: string
    }
  | {
      type: 'attendance_checkin'
      data: { checkin?: { memberName: string; memberId: string; membershipType: string; timestamp: string } }
      timestamp: string
    }
  | {
      type: 'member_update'
      data: { member?: unknown }
      timestamp: string
    }
  | {
      type: 'notification'
      data: { message?: string; type?: string }
      timestamp: string
    }
  | {
      type: 'connected'
      data: { clientId?: string }
      timestamp: string
    }

export function useRealtimeUpdates() {
  const [events, setEvents] = useState<RealtimeEvent[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    // Create EventSource connection
    const eventSource = new EventSource('/api/sse')
    eventSourceRef.current = eventSource

    // Handle connection open
    eventSource.onopen = () => {
      setIsConnected(true)
    }

    // Handle incoming messages
    eventSource.onmessage = (event) => {
      try {
        const realtimeEvent: RealtimeEvent = JSON.parse(event.data)
        setEvents(prev => [...prev.slice(-49), realtimeEvent]) // Keep last 50 events
      } catch (error) {
        console.error('Failed to parse SSE event:', error)
      }
    }

    // Handle connection errors
    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error)
      setIsConnected(false)

      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        if (eventSource.readyState === EventSource.CLOSED) {
          // Reconnect logic would go here, but for simplicity we'll just log
          console.log('Attempting to reconnect...')
        }
      }, 5000)
    }

    // Cleanup on unmount
    return () => {
      eventSource.close()
      setIsConnected(false)
    }
  }, [])

  // Function to send test events (for development)
  const sendTestEvent = async (type: RealtimeEvent['type'], data: unknown) => {
    try {
      await fetch('/api/sse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, data }),
      })
    } catch (error) {
      console.error('Failed to send test event:', error)
    }
  }

  return {
    events,
    isConnected,
    sendTestEvent,
    latestEvent: events[events.length - 1]
  }
}