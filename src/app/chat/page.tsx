'use client';

import { useChat } from '@ai-sdk/react';
import {
  Bot,
  Copy,
  Check,
  CornerDownLeft,
  Sparkles,
  Plus,
  MessageSquare,
  Home,
  Settings,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Response } from '@/components/ui/shadcn-io/ai/response';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { messages, sendMessage, status, error, setMessages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isLoading = status === 'streaming' || status === 'submitted';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
  };

  const suggestedPrompts = [
    { icon: '💡', text: 'Explain quantum computing' },
    { icon: '✍️', text: 'Write a haiku about coding' },
    { icon: '⚛️', text: 'React best practices' },
    { icon: '🐛', text: 'Help me debug my code' },
  ];

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          'flex h-full flex-col border-r border-border/50 bg-muted/30 transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
        )}
      >
        {/* Sidebar Header */}
        <div className="flex h-14 items-center justify-between border-b border-border/50 px-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
              <Sparkles className="h-4 w-4 text-background" />
            </div>
            <span className="font-semibold">AI Chat</span>
          </Link>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <Button
            onClick={handleNewChat}
            variant="outline"
            className="w-full justify-start gap-2 border-dashed"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* Chat History (placeholder) */}
        <div className="flex-1 overflow-y-auto px-3">
          <div className="mb-2 px-2 text-xs font-medium text-muted-foreground">
            Recent
          </div>
          {messages.length > 0 && (
            <button className="flex w-full items-center gap-2 rounded-lg bg-background/50 px-3 py-2 text-left text-sm transition-colors hover:bg-background">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">
                {getMessageText(messages[0]).slice(0, 30)}...
              </span>
            </button>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-border/50 p-3">
          <div className="flex flex-col gap-1">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
            <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-background hover:text-foreground">
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Chat Header */}
        <header className="flex h-14 items-center justify-between border-b border-border/50 px-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="h-8 w-8"
            >
              {sidebarOpen ? (
                <PanelLeftClose className="h-4 w-4" />
              ) : (
                <PanelLeft className="h-4 w-4" />
              )}
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">GPT-4o-mini</span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-600">
                Online
              </span>
            </div>
          </div>
        </header>

        {/* Messages Area */}
        <div className="relative flex-1 overflow-hidden">
          <div className="absolute inset-0 overflow-y-auto">
            <div className="mx-auto max-w-3xl px-4 py-8">
              {messages.length === 0 ? (
                /* Empty state */
                <div className="flex min-h-[60vh] flex-col items-center justify-center">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 animate-pulse rounded-3xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 blur-2xl" />
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-foreground to-foreground/80 shadow-2xl">
                      <Sparkles className="h-10 w-10 text-background" />
                    </div>
                  </div>

                  <h1 className="mb-3 text-center text-3xl font-semibold tracking-tight">
                    How can I help you today?
                  </h1>
                  <p className="mb-10 max-w-md text-center text-muted-foreground">
                    Start a conversation or try one of these suggestions
                  </p>

                  {/* Suggested prompts */}
                  <div className="grid w-full max-w-xl grid-cols-2 gap-3">
                    {suggestedPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setInput(prompt.text);
                          textareaRef.current?.focus();
                        }}
                        className="group flex items-center gap-3 rounded-xl border border-border/50 bg-card/50 p-4 text-left text-sm transition-all hover:border-foreground/20 hover:bg-card hover:shadow-md"
                      >
                        <span className="text-lg">{prompt.icon}</span>
                        <span className="text-muted-foreground transition-colors group-hover:text-foreground">
                          {prompt.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Messages */
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        'group flex gap-4',
                        message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                      )}
                    >
                      {/* Avatar */}
                      <div
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                          message.role === 'user'
                            ? 'bg-foreground text-background'
                            : 'bg-muted text-muted-foreground ring-1 ring-border/50'
                        )}
                      >
                        {message.role === 'user' ? (
                          <span className="text-xs font-medium">U</span>
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>

                      {/* Message content */}
                      <div
                        className={cn(
                          'relative max-w-[80%] space-y-2',
                          message.role === 'user' ? 'items-end' : 'items-start'
                        )}
                      >
                        <div
                          className={cn(
                            'rounded-2xl px-4 py-3',
                            message.role === 'user'
                              ? 'bg-foreground text-background'
                              : 'bg-muted/50 ring-1 ring-border/50'
                          )}
                        >
                          {message.role === 'assistant' ? (
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                              <Response>{getMessageText(message)}</Response>
                            </div>
                          ) : (
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">
                              {getMessageText(message)}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        {message.role === 'assistant' && (
                          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                              onClick={() =>
                                copyToClipboard(getMessageText(message), message.id)
                              }
                            >
                              {copiedId === message.id ? (
                                <Check className="mr-1 h-3 w-3" />
                              ) : (
                                <Copy className="mr-1 h-3 w-3" />
                              )}
                              {copiedId === message.id ? 'Copied' : 'Copy'}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Loading indicator */}
                  {isLoading && messages[messages.length - 1]?.role === 'user' && (
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground ring-1 ring-border/50">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="flex items-center gap-1 rounded-2xl bg-muted/50 px-4 py-3 ring-1 ring-border/50">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60" />
                      </div>
                    </div>
                  )}

                  {/* Error message */}
                  {error && (
                    <div className="mx-auto max-w-md rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-center text-sm text-destructive">
                      {error.message || 'Something went wrong. Please try again.'}
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-border/50 bg-background p-4">
          <div className="mx-auto max-w-3xl">
            <form onSubmit={handleSubmit} className="relative">
              <div className="overflow-hidden rounded-2xl border border-border/50 bg-muted/30 shadow-sm transition-all focus-within:border-foreground/20 focus-within:bg-background focus-within:shadow-md">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message AI..."
                  disabled={isLoading}
                  rows={1}
                  className="max-h-32 min-h-[52px] w-full resize-none bg-transparent px-4 py-3.5 pr-14 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
                  style={{ fieldSizing: 'content' } as React.CSSProperties}
                />
                <div className="absolute bottom-2 right-2">
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim() || isLoading}
                    className={cn(
                      'h-9 w-9 rounded-xl transition-all',
                      input.trim()
                        ? 'bg-foreground text-background hover:bg-foreground/90'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    <CornerDownLeft className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </form>
            <p className="mt-2 text-center text-xs text-muted-foreground/60">
              <kbd className="rounded border border-border/50 bg-muted/50 px-1 py-0.5 font-mono text-[10px]">
                Enter
              </kbd>{' '}
              to send ·{' '}
              <kbd className="rounded border border-border/50 bg-muted/50 px-1 py-0.5 font-mono text-[10px]">
                Shift + Enter
              </kbd>{' '}
              for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
