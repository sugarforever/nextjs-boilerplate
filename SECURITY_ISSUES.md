# Security Issues - Action Required

**Scan Date:** 2026-01-12
**Status:** Partially remediated

## Fixed Issues

- [x] **Unauthenticated Chat API** - Added session check to `/api/chat` endpoint
- [x] **Unauthenticated Server Action for Role Updates** - Added admin session check to `src/app/admin/users/actions.ts`

---

## Remaining Issues

### HIGH

#### 2. Dependency Vulnerability - Command Injection in glob
**Package:** `glob` (10.2.0 - 10.4.5)
**CVE:** GHSA-5j98-mcp5-4vw2
**Risk:** Command injection via CLI

**Fix:**
```bash
npm update glob
```

---

#### 3. Client-Side Only Admin Protection
**File:** `src/components/AdminGuard.tsx`
**Risk:** Admin protection is purely client-side and can be bypassed.

**Fix:** Create `middleware.ts` in the project root:
```typescript
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

---

#### 4. Admin Page Leaks User Data Server-Side
**File:** `src/app/admin/users/page.tsx:5`
**Risk:** User data is fetched before client-side auth check runs.

**Fix:** Add server-side auth check:
```typescript
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function UsersPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const users = await prisma.user.findMany({...});
  // ...
}
```

---

#### 5. Sensitive Environment Variables Exposed to Client
**File:** `next.config.mjs:3-9`
**Risk:** `GOOGLE_CLIENT_SECRET` and `DATABASE_URL` are bundled into client JavaScript.

**Current Code:**
```javascript
env: {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET, // EXPOSED!
  DATABASE_URL: process.env.DATABASE_URL, // EXPOSED!
}
```

**Fix:** Remove sensitive variables from the `env` config. Only use `NEXT_PUBLIC_` prefix for client-safe variables:
```javascript
const nextConfig = {
  // Remove the env block entirely, or only include public variables
};
```

---

### MEDIUM

#### 6. Email Verification Disabled
**File:** `src/lib/auth.ts:11`
**Risk:** Accounts can be created without email verification.

**Fix:**
```typescript
emailAndPassword: {
  enabled: true,
  requireEmailVerification: true, // Change to true
}
```

---

#### 7. Weak Password Policy
**File:** `src/app/sign-up/page.tsx:31`
**Risk:** Only 8-character minimum, no complexity requirements.

**Fix:** Add stronger validation:
```typescript
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
if (!passwordRegex.test(password)) {
  setError('Password must contain uppercase, lowercase, number, and special character');
  return;
}
```

---

#### 8. Missing Security Headers
**File:** `next.config.mjs`
**Risk:** No security headers configured.

**Fix:** Add to `next.config.mjs`:
```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};
```

---

#### 9. Missing Rate Limiting
**Risk:** No protection against brute force on auth endpoints or API abuse.

**Fix:** Implement rate limiting with Upstash Redis or similar:
```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
});
```

---

### LOW

#### 10. Dependency Vulnerabilities
**Packages:**
- `@supabase/auth-js` (<2.69.1) - Insecure path routing
- `brace-expansion` (1.0.0-1.1.11) - ReDoS
- `nanoid` (<3.3.8) - Predictable results

**Fix:**
```bash
npm audit fix
```

---

#### 11. dangerouslySetInnerHTML Usage
**Files:**
- `src/components/ui/shadcn-io/code-block/index.tsx:616`
- `src/components/ui/shadcn-io/code-block/server.tsx:59`

**Risk:** Potential XSS if user input reaches these components. Currently mitigated by Shiki sanitization.

**Recommendation:** Ensure all input to code-block components comes from trusted sources only.

---

## Priority Order for Fixes

1. ~~**Immediate:** Issue #1 (Server Action auth) - privilege escalation risk~~ **FIXED**
2. **Immediate:** Issue #5 (Remove secrets from next.config) - credential exposure
3. **Before Production:** Issues #2, #3, #4 (Dependencies, Middleware, Admin page)
4. **Best Practice:** Issues #6-11 (Hardening)

---

## Verification Commands

```bash
# Check for dependency vulnerabilities
npm audit

# After fixes, run security scan again
# Use the security scan skill to verify remediation
```
