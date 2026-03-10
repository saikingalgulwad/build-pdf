import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type Props = {
  params: { id: string };
  searchParams: { q?: string };
};

export default async function ChapterPage({ params, searchParams }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login');

  const chapter = await prisma.chapter.findFirst({
    where: { id: params.id, userId: session.user.id }
  });

  if (!chapter) notFound();

  const q = searchParams.q?.trim() || '';

  const conversations = await prisma.conversation.findMany({
    where: {
      chapterId: chapter.id,
      userId: session.user.id,
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

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{chapter.name}</h1>
          <p className="text-slate-300">Conversation Viewer</p>
        </div>
        <Link href={`/api/export/pdf?chapterId=${chapter.id}`} className="btn">Download Chapter as PDF</Link>
      </div>

      <form className="mt-6">
        <input defaultValue={q} name="q" className="input" placeholder="Search conversations" />
      </form>

      <section className="mt-6 space-y-4">
        {conversations.map((item) => (
          <article key={item.id} className="rounded-xl border border-border bg-card p-5">
            <div className="mb-2 flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold">{item.title}</p>
                <p className="text-xs text-slate-400">{item.createdAt.toLocaleString()}</p>
              </div>
              <form action={`/api/conversation?id=${item.id}`} method="post">
                <input type="hidden" name="_method" value="delete" />
                <button className="text-sm text-red-300">Delete</button>
              </form>
            </div>
            <h3 className="font-medium text-accent">Question</h3>
            <p className="mb-3 whitespace-pre-wrap text-slate-200">{item.question}</p>
            <h3 className="font-medium text-accent">Answer</h3>
            <p className="whitespace-pre-wrap text-slate-200">{item.answer}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
