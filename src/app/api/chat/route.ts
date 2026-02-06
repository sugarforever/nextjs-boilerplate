import { openai } from '@ai-sdk/openai';
import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export const maxDuration = 30;

export async function POST(req: Request) {
  if (process.env.NEXT_PUBLIC_ENABLE_AI_CHAT !== 'true') {
    return new Response('Not Found', { status: 404 });
  }

  // Verify user is authenticated before allowing API access (if auth is available)
  if (auth) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: 'You are a helpful assistant. Be concise and clear in your responses.',
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
