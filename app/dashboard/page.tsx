import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login');

  const [chapters, conversations] = await Promise.all([
    prisma.chapter.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: 'desc' } }),
    prisma.conversation.findMany({
      where: { userId: session.user.id },
      include: { chapter: true },
      orderBy: { createdAt: 'desc' },
      take: 20
    })
  ]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-slate-300">Manage chapters and saved ChatGPT conversations.</p>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-xl font-semibold">My Chapters</h2>
          <form action="/api/chapter" method="post" className="mt-4 flex gap-2">
            <input name="name" placeholder="Create chapter" className="input" required />
            <button className="btn" type="submit">Add</button>
          </form>
          <div className="mt-4 space-y-2">
            {chapters.map((chapter) => (
              <Link key={chapter.id} href={`/dashboard/chapter/${chapter.id}`} className="block rounded-md border border-border p-3 hover:border-accent">
                {chapter.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-xl font-semibold">Saved Conversations</h2>
          <div className="mt-4 space-y-3">
            {conversations.map((item) => (
              <article key={item.id} className="rounded-md border border-border p-3">
                <p className="text-sm text-slate-400">{item.chapter.name} • {item.createdAt.toLocaleString()}</p>
                <p className="font-semibold">{item.title}</p>
                <p className="line-clamp-2 text-sm text-slate-300">{item.question}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
