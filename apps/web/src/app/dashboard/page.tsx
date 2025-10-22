import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

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
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Leads</h2>
          <p className="text-3xl font-bold mb-4">24</p>
          <p className="text-muted-foreground mb-4">+3 from last week</p>
          <Link href="/dashboard/leads" className="text-blue-500 hover:underline">
            View Leads →
          </Link>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Customers</h2>
          <p className="text-3xl font-bold mb-4">142</p>
          <p className="text-muted-foreground mb-4">+12 from last month</p>
          <Link href="/dashboard/customers" className="text-blue-500 hover:underline">
            View Customers →
          </Link>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Quotes</h2>
          <p className="text-3xl font-bold mb-4">8</p>
          <p className="text-muted-foreground mb-4">3 awaiting approval</p>
          <Link href="/dashboard/quotes" className="text-blue-500 hover:underline">
            View Quotes →
          </Link>
        </div>
      </div>

      <div className="mt-8 border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <ul className="space-y-2">
          <li className="flex items-center">
            <div className="bg-blue-100 rounded-full p-2 mr-3">
              <span className="text-blue-800 font-bold">1</span>
            </div>
            <div>
              <p className="font-medium">New lead received</p>
              <p className="text-sm text-muted-foreground">John Smith - john@example.com</p>
            </div>
          </li>
          <li className="flex items-center">
            <div className="bg-green-100 rounded-full p-2 mr-3">
              <span className="text-green-800 font-bold">2</span>
            </div>
            <div>
              <p className="font-medium">Quote approved</p>
              <p className="text-sm text-muted-foreground">Quote #Q-2023-001 for $1,250</p>
            </div>
          </li>
          <li className="flex items-center">
            <div className="bg-yellow-100 rounded-full p-2 mr-3">
              <span className="text-yellow-800 font-bold">3</span>
            </div>
            <div>
              <p className="font-medium">Job scheduled</p>
              <p className="text-sm text-muted-foreground">Tree trimming for 123 Oak St</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}