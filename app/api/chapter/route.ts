import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const contentType = request.headers.get('content-type') || '';
  const name = contentType.includes('application/json')
    ? (await request.json()).name
    : (await request.formData()).get('name');

  if (!name || typeof name !== 'string') {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  const chapter = await prisma.chapter.create({
    data: { name, userId: session.user.id }
  });

  if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.json(chapter, { status: 201 });
}
