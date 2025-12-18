# Next.js Boilerplate

A modern, production-ready Next.js boilerplate with AI chat, authentication, role-based access control, and admin console.

## Features

- **AI Chat** - Built-in AI assistant powered by OpenAI with:
  - Streaming responses using Vercel AI SDK
  - Markdown rendering with syntax highlighting
  - Modern sidebar layout (ChatGPT-style)
  - shadcn.io AI components
- **Next.js 16** - App Router, Server Components, and modern React features
- **TypeScript** - Type-safe development experience
- **Better Auth** - Secure email/password authentication
- **Prisma** - Type-safe database ORM with PostgreSQL
- **Role-Based Access Control** - USER and ADMIN roles with protected routes
- **Admin Console** - Complete admin panel with:
  - User management dashboard
  - Role assignment capabilities
  - User statistics and analytics
- **shadcn/ui** - Beautiful, accessible UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Vercel Analytics** - Built-in analytics support

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **AI** | Vercel AI SDK, OpenAI GPT-4o-mini |
| **Authentication** | Better Auth |
| **Database** | PostgreSQL with Prisma ORM |
| **Styling** | Tailwind CSS |
| **UI Components** | Radix UI + shadcn/ui + shadcn.io AI |
| **Icons** | Lucide React |
| **Deployment** | Vercel-ready |

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- OpenAI API key (for AI Chat)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd nextjs-boilerplate
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Update the following variables:

```env
# Database connection string
DATABASE_URL=postgresql://user:password@localhost:5432/your_database

# Better Auth secret (generate a random string)
BETTER_AUTH_SECRET=your-secret-key-here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# OpenAI API Key (for AI Chat)
OPENAI_API_KEY=sk-your-openai-api-key
```

To generate a secure secret for `BETTER_AUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 3. Database Setup

Run Prisma migrations to create database tables:

```bash
npx prisma migrate dev
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin console pages
│   │   ├── users/         # User management
│   │   ├── layout.tsx     # Admin layout with sidebar
│   │   └── page.tsx       # Admin dashboard
│   ├── chat/              # AI Chat page
│   │   ├── layout.tsx     # Chat layout (full-screen)
│   │   └── page.tsx       # Chat interface with sidebar
│   ├── sign-in/           # Sign in page
│   ├── sign-up/           # Sign up page
│   ├── api/               # API routes
│   │   ├── auth/          # Better Auth endpoints
│   │   └── chat/          # AI Chat streaming endpoint
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   │   └── shadcn-io/    # shadcn.io AI components
│   │       └── ai/       # Conversation, Message, Response, etc.
│   ├── AdminGuard.tsx    # Admin route protection
│   ├── Navbar.tsx        # Navigation bar
│   └── Footer.tsx        # Footer
├── lib/                   # Utilities and configurations
│   ├── auth.ts           # Better Auth configuration
│   ├── auth-client.ts    # Client-side auth helpers
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Utility functions
└── middleware.ts          # Next.js middleware

prisma/
└── schema.prisma          # Database schema

scripts/
└── make-admin.ts          # Admin promotion script
```

## AI Chat

The AI Chat feature provides a full-featured conversational interface:

### Features
- **Streaming responses** - Real-time text streaming from OpenAI
- **Markdown support** - Rich text formatting with syntax highlighting
- **Code blocks** - Syntax-highlighted code with copy functionality
- **Sidebar layout** - Collapsible sidebar with chat history
- **New chat** - Start fresh conversations
- **Responsive design** - Works on desktop and mobile

### Customization

To change the AI model, edit `src/app/api/chat/route.ts`:

```typescript
const result = streamText({
  model: openai('gpt-4o-mini'), // Change to 'gpt-4o', 'gpt-4-turbo', etc.
  system: 'Your custom system prompt here',
  messages: convertToModelMessages(messages),
});
```

## User Roles

The application supports two roles:

- **USER** - Default role for new signups
- **ADMIN** - Full access to admin console and user management

### Promoting Users to Admin

To promote a user to admin role, use the built-in npm script:

```bash
npm run make-admin user@example.com
```

## Routes

### Public Routes

- `/` - Homepage
- `/chat` - AI Chat interface
- `/sign-in` - Sign in page
- `/sign-up` - Sign up page

### Protected Routes (Admin Only)

- `/admin` - Admin dashboard with user statistics
- `/admin/users` - User management with role assignment

Admin routes are protected by the `AdminGuard` component which:
- Redirects unauthenticated users to `/sign-in`
- Redirects non-admin users to `/`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run make-admin <email>` - Promote user to admin role

## Database

The application uses Prisma with PostgreSQL. Main models:

- **User** - User accounts with role-based access
- **Session** - Authentication sessions
- **Account** - Better Auth account data
- **Verification** - Email verification tokens

To view/edit your database:

```bash
npx prisma studio
```

To create a new migration after schema changes:

```bash
npx prisma migrate dev --name your_migration_name
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `BETTER_AUTH_SECRET`
   - `NEXT_PUBLIC_APP_URL`
   - `OPENAI_API_KEY`
4. Deploy!

### Database on Vercel

For production, consider using:
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Supabase](https://supabase.com/)
- [Railway](https://railway.app/)
- [Neon](https://neon.tech/)

## Customization

### Adding New UI Components

This project uses shadcn/ui. To add new components:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
```

### Adding AI Components

shadcn.io AI components are pre-installed. To add more:

```bash
npx shadcn@latest add https://www.shadcn.io/registry/ai.json
```

### Modifying Authentication

Edit `src/lib/auth.ts` to customize Better Auth configuration:

- Add OAuth providers
- Modify session duration
- Add custom fields to user model

### Adding New Roles

1. Update the `Role` enum in `prisma/schema.prisma`
2. Run `npx prisma migrate dev`
3. Update role checks in `AdminGuard.tsx` and other protected components

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
- [Better Auth Documentation](https://www.better-auth.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [shadcn.io AI Components](https://www.shadcn.io/ai)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

MIT
