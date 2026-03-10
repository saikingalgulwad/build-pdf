import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-20">
      <p className="mb-4 text-accent">Chrome Extension + Next.js App</p>
      <h1 className="text-4xl font-bold">Save ChatGPT conversations into searchable chapters.</h1>
      <p className="mt-6 max-w-2xl text-slate-300">
        Create chapters like Java Learning, React Notes, Interview Preparation, and AI Prompts. Save directly from ChatGPT with the extension and download clean chapter PDFs anytime.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/login" className="btn">Login</Link>
        <Link href="/dashboard" className="rounded-lg border border-border px-4 py-2">Open Dashboard</Link>
      </div>
    </main>
  );
}
