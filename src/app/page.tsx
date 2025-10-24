'use client';

import Link from 'next/link';
import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Zap, Shield, Users } from 'lucide-react';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Build faster with our boilerplate
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A modern Next.js boilerplate with authentication, role-based access control,
            and admin console. Everything you need to start your next project.
          </p>
          <div className="flex gap-4 justify-center">
            {session ? (
              <>
                {session.user?.role === 'ADMIN' ? (
                  <Button size="lg" asChild>
                    <Link href="/admin">
                      Go to Admin Console
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/">
                      Welcome, {session.user?.name}
                    </Link>
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button size="lg" asChild>
                  <Link href="/sign-up">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 space-y-4">
              <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Fast & Modern</h3>
              <p className="text-muted-foreground">
                Built with Next.js 14, React 18, and modern best practices for optimal performance.
              </p>
            </Card>
            <Card className="p-6 space-y-4">
              <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Secure Authentication</h3>
              <p className="text-muted-foreground">
                Email/password authentication with better-auth and role-based access control.
              </p>
            </Card>
            <Card className="p-6 space-y-4">
              <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Admin Console</h3>
              <p className="text-muted-foreground">
                Complete admin panel with user management and role assignment capabilities.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold">Ready to get started?</h2>
          <p className="text-xl text-muted-foreground">
            Create your account today and start building your application.
          </p>
          {!session && (
            <Button size="lg" asChild>
              <Link href="/sign-up">
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
