import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // This check is redundant due to layout, but good for safety
  if (!user) {
    return redirect('/login')
  }

  return (
    <div>
        <h1 className="text-2xl font-bold">Welcome to your Dashboard</h1>
        <p className="text-muted-foreground">You are logged in as {user.email}</p>
        <p>This is the main content area.</p>
    </div>
  )
}