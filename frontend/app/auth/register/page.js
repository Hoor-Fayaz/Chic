import RegisterForm from '@/components/forms/RegisterForm';

export const metadata = {
  title: 'Register | Chic',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 border rounded shadow">
        <h1 className="text-2xl mb-4">Register</h1>
        <RegisterForm />
      </div>
    </div>
  );
}
