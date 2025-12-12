import { WritableStreamDefaultWriter } from 'stream/web'

// Store active connections
const clients = new Map<string, WritableStreamDefaultWriter>()

// Event types for real-time updates
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

// Broadcast event to all connected clients
export function broadcastEvent(event: RealtimeEvent) {
  const message = `data: ${JSON.stringify(event)}\n\n`

  clients.forEach((writer, clientId) => {
    try {
      writer.write(new TextEncoder().encode(message))
    } catch {
      // Remove disconnected client
      clients.delete(clientId)
    }
  })
}

// Add client to the map
export function addClient(clientId: string, writer: WritableStreamDefaultWriter) {
  clients.set(clientId, writer)
}

// Remove client from the map
export function removeClient(clientId: string) {
  clients.delete(clientId)
}