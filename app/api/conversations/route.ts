import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const chapterId = url.searchParams.get('chapterId') || undefined;
  const q = url.searchParams.get('q') || '';

  const conversations = await prisma.conversation.findMany({
    where: {
      userId: session.user.id,
      chapterId,
      OR: q
        ? [
            { title: { contains: q, mode: 'insensitive' } },
            { question: { contains: q, mode: 'insensitive' } },
            { answer: { contains: q, mode: 'insensitive' } }
          ]
        : undefined
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(conversations);
}
