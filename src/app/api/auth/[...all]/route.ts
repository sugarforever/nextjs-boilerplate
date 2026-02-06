import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const notConfigured = () => new Response('Not Found', { status: 404 });

const handler = auth
  ? toNextJsHandler(auth)
  : { GET: notConfigured, POST: notConfigured };

export const { GET, POST } = handler;
