import { NextRequest, NextResponse } from 'next/server'
import { broadcastEvent, addClient, removeClient, type RealtimeEvent } from '@/lib/sse'

export async function GET(request: NextRequest) {
  // Create a unique client ID
  const clientId = crypto.randomUUID()

  // Set up Server-Sent Events
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const initialMessage = `data: ${JSON.stringify({
        type: 'connected',
        data: { clientId },
        timestamp: new Date().toISOString()
      })}\n\n`

      controller.enqueue(new TextEncoder().encode(initialMessage))

      // Store the writer for broadcasting
      const writer = {
        write: (chunk: Uint8Array) => {
          try {
            controller.enqueue(chunk)
          } catch {
            // Client disconnected
            removeClient(clientId)
          }
        }
      }

      addClient(clientId, writer as WritableStreamDefaultWriter)

      // Clean up on client disconnect
      request.signal.addEventListener('abort', () => {
        removeClient(clientId)
      })
    },

    cancel() {
      removeClient(clientId)
    }
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  })
}

// POST endpoint to manually trigger events (for testing/admin purposes)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const event: RealtimeEvent = {
      type: body.type,
      data: body.data,
      timestamp: new Date().toISOString()
    }

    broadcastEvent(event)

    return NextResponse.json({
      success: true,
      message: 'Event broadcasted successfully'
    })
  } catch {
    return NextResponse.json(
      { success: false, message: 'Failed to broadcast event' },
      { status: 500 }
    )
  }
}