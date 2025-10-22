import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  // If user is authenticated, redirect to dashboard
  if (user) {
    return redirect('/dashboard');
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to TreeProAI</h1>
      <Link href="/login" className="text-blue-500 hover:underline">
        Go to Login
      </Link>
    </div>
  );
}