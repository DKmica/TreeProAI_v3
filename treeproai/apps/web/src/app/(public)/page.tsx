import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const { userId } = auth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">TreeProAI</h1>
        <div>
          {userId ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <Link href="/sign-in">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-4xl md:text-6xl font-bold mb-4">
          Instant AI Tree Estimates
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
          Upload photos of your trees and get a professional estimate in seconds.
          Streamline your business, win more bids, and save time.
        </p>
        <Link href={userId ? "/dashboard/quote-requests/new" : "/sign-up"}>
          <Button size="lg" className="text-lg px-8 py-6">
            Get Your Free Estimate
          </Button>
        </Link>
      </main>
    </div>
  );
}