/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Auto-enable auth when DATABASE_URL is configured
    NEXT_PUBLIC_ENABLE_AUTH: process.env.DATABASE_URL ? 'true' : 'false',
  }
};

export default nextConfig;
