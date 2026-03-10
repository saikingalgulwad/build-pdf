import AuthForm from '@/components/AuthForm';

export default function LoginPage() {
  return (
    <main className="mx-auto min-h-screen max-w-md px-6 py-16">
      <h1 className="mb-6 text-3xl font-bold">Login</h1>
      <AuthForm />
    </main>
  );
}
