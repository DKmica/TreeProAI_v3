import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <XCircle className="w-16 h-16 text-destructive mb-4" />
      <h1 className="text-3xl font-bold mb-2">Payment Canceled</h1>
      <p className="text-muted-foreground mb-6">Your payment was not processed. You can try again from the invoice page.</p>
      <Link href="/dashboard">
        <Button variant="outline">Return to Dashboard</Button>
      </Link>
    </div>
  );
}