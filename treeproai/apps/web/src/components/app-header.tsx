import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export function AppHeader() {
  return (
    <header className="flex h-16 items-center justify-end gap-4 border-b bg-background px-6">
      <Link href="/quote-requests/new">
        <Button>
          <PlusCircle className="w-4 h-4 mr-2" />
          New Quote
        </Button>
      </Link>
      <OrganizationSwitcher />
      <UserButton />
    </header>
  );
}