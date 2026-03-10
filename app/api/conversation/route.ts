import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const conversationSchema = z.object({
  chapterId: z.string(),
  title: z.string().min(1),
  notes: z.string().optional(),
  question: z.string().min(1),
  answer: z.string().min(1),
  pageUrl: z.string().url()
});

async function removeConversation(id: string, userId: string) {
  await prisma.conversation.deleteMany({ where: { id, userId } });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const contentType = request.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    const formData = await request.formData();
    const methodOverride = String(formData.get('_method') || '').toLowerCase();
    const id = new URL(request.url).searchParams.get('id');
    if (methodOverride === 'delete' && id) {
      await removeConversation(id, session.user.id);
      return NextResponse.redirect(new URL(request.headers.get('referer') || '/dashboard', request.url));
    }
    return NextResponse.json({ error: 'Unsupported form action' }, { status: 400 });
  }

  const parsed = conversationSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const chapter = await prisma.chapter.findFirst({
    where: { id: parsed.data.chapterId, userId: session.user.id }
  });

  if (!chapter) {
    return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
  }

  const conversation = await prisma.conversation.create({
    data: { ...parsed.data, userId: session.user.id }
  });

  return NextResponse.json(conversation, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = new URL(request.url).searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  await removeConversation(id, session.user.id);
  return NextResponse.json({ ok: true });
}
