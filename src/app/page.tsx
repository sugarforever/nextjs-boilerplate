'use client';

import Link from 'next/link';
import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { isAuthEnabled, isChatEnabled } from '@/lib/features';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col">
      {/* Hero */}
      <section className="flex flex-1 items-center justify-center px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Start building faster
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A minimal Next.js boilerplate with the essentials.
            Authentication, admin panel, and AI chat — all optional.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            {isChatEnabled && (
              <Button asChild>
                <Link href="/chat">
                  Try AI Chat
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
            {isAuthEnabled && !session && (
              <Button variant={isChatEnabled ? 'outline' : 'default'} asChild>
                <Link href="/sign-up">
                  Get started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
            {isAuthEnabled && session?.user?.role === 'ADMIN' && (
              <Button variant="outline" asChild>
                <Link href="/admin">Admin Console</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-px overflow-hidden rounded-lg border border-border sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCell
              title="Next.js"
              description="Built on the latest version with App Router and React Server Components."
            />
            {isAuthEnabled && (
              <FeatureCell
                title="Authentication"
                description="Email/password auth with better-auth and role-based access control."
              />
            )}
            {isAuthEnabled && (
              <FeatureCell
                title="Admin Panel"
                description="User management dashboard with role assignment."
              />
            )}
            {isChatEnabled && (
              <FeatureCell
                title="AI Chat"
                description="OpenAI-powered assistant with streaming and markdown."
              />
            )}
            <FeatureCell
              title="Tailwind CSS"
              description="Utility-first styling with shadcn/ui components."
            />
            <FeatureCell
              title="TypeScript"
              description="End-to-end type safety across the entire stack."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCell({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-background p-6 transition-colors duration-200 hover:bg-muted/50">
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
