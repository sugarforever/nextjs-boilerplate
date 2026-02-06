'use client';

import { useChat } from '@ai-sdk/react';
import {
  Bot,
  Copy,
  Check,
  CornerDownLeft,
  ArrowLeft,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Response } from '@/components/ui/shadcn-io/ai/response';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { isChatEnabled } from '@/lib/features';

export default function ChatPage() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { messages, sendMessage, status, error, setMessages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isLoading = status === 'streaming' || status === 'submitted';

  useEffect(() => {
    if (!isChatEnabled) {
      router.replace('/');
    }
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isChatEnabled) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getMessageText = (message: (typeof messages)[0]) => {
    return message.parts
      .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
      .map((part) => part.text)
      .join('');
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <header className="flex h-12 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span className="text-sm font-medium">AI Chat</span>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => {
              setMessages([]);
              setInput('');
            }}
          >
            Clear
          </Button>
        )}
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-4 py-8">
          {messages.length === 0 ? (
            <div className="flex min-h-[50vh] flex-col items-center justify-center">
              <h1 className="text-xl font-semibold tracking-tight">
                How can I help?
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Ask me anything to get started
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'group flex gap-3',
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                      message.role === 'user'
                        ? 'bg-foreground text-background'
                        : 'border border-border'
                    )}
                  >
                    {message.role === 'user' ? (
                      <span className="text-[10px] font-medium">U</span>
                    ) : (
                      <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </div>

                  <div
                    className={cn(
                      'max-w-[80%] space-y-1',
                      message.role === 'user' ? 'items-end' : 'items-start'
                    )}
                  >
                    <div
                      className={cn(
                        'rounded-lg px-3.5 py-2.5 text-sm',
                        message.role === 'user'
                          ? 'bg-foreground text-background'
                          : 'bg-muted'
                      )}
                    >
                      {message.role === 'assistant' ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <Response>{getMessageText(message)}</Response>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap leading-relaxed">
                          {getMessageText(message)}
                        </p>
                      )}
                    </div>

                    {message.role === 'assistant' && (
                      <button
                        className="flex items-center gap-1 px-1 text-[11px] text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:text-foreground cursor-pointer"
                        onClick={() =>
                          copyToClipboard(getMessageText(message), message.id)
                        }
                      >
                        {copiedId === message.id ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                        {copiedId === message.id ? 'Copied' : 'Copy'}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border">
                    <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex items-center gap-1 rounded-lg bg-muted px-3.5 py-2.5">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50" />
                  </div>
                </div>
              )}

              {error && (
                <p className="text-center text-sm text-destructive">
                  {error.message || 'Something went wrong. Please try again.'}
                </p>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="mx-auto max-w-2xl">
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Send a message..."
              disabled={isLoading}
              rows={1}
              className="max-h-32 min-h-[44px] w-full resize-none rounded-lg border border-border bg-background px-3.5 py-2.5 pr-12 text-sm outline-none transition-colors duration-200 placeholder:text-muted-foreground focus:border-foreground/20 disabled:opacity-50"
              style={{ fieldSizing: 'content' } as React.CSSProperties}
            />
            <div className="absolute bottom-1.5 right-1.5">
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading}
                className="h-8 w-8 rounded-md"
              >
                <CornerDownLeft className="h-3.5 w-3.5" />
              </Button>
            </div>
          </form>
          <p className="mt-2 text-center text-[11px] text-muted-foreground/50">
            Enter to send &middot; Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
