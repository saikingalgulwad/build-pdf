import NextAuth from 'next-auth';

import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const nextAuthHandler = NextAuth(authOptions);

export async function GET(request: Request, context: { params: { nextauth: string[] } }) {
  return nextAuthHandler(request, context);
}

export async function POST(request: Request, context: { params: { nextauth: string[] } }) {
  return nextAuthHandler(request, context);
}
