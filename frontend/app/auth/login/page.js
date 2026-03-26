import LoginForm from '@/components/forms/LoginForm';

export const metadata = {
  title: 'Login | Chic',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 border rounded shadow">
        <h1 className="text-2xl mb-4">Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}
