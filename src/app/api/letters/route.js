
import connectDB from '@/lib/db';
import Letter from '@/lib/models/Letter';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

let clients = [];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('stream') === 'true') {
    const encoder = new TextEncoder();
  
    const stream = new ReadableStream({
      start(controller) {
        const client = {
          id: Date.now(),
          send: (data) => {
            try {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
              );
            } catch (e) {
              console.error('Error sending SSE:', e);
            }
          }
        };

        clients.push(client);

        request.signal.addEventListener('abort', () => {
          clients = clients.filter(c => c.id !== client.id);
          try {
            controller.close();
          } catch (e) {
          }
        });
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  }

  try {
    await connectDB();
    const letters = await Letter.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(letters);
  } catch (error) {
    console.error('Error fetching letters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch letters' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    if (!body.name || !body.phone || !body.wishes || body.wishes.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const letter = new Letter(body);
    await letter.save();

    const letterObj = letter.toObject();
    clients.forEach(client => {
      try {
        client.send(letterObj);
      } catch (e) {
        console.error('Error notifying client:', e);
      }
    });

    return NextResponse.json(letterObj, { status: 201 });
  } catch (error) {
    console.error('Error creating letter:', error);
    return NextResponse.json(
      { error: 'Failed to create letter' },
      { status: 500 }
    );
  }
}