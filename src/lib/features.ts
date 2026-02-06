// Feature flags derived from environment variables
// Auth is auto-enabled when DATABASE_URL is configured
// AI Chat must be explicitly enabled via NEXT_PUBLIC_ENABLE_AI_CHAT=true

export const isAuthEnabled = process.env.NEXT_PUBLIC_ENABLE_AUTH === 'true';
export const isChatEnabled = process.env.NEXT_PUBLIC_ENABLE_AI_CHAT === 'true';
