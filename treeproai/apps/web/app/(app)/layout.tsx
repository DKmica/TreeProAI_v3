"use client";

import { UserButton, useAuth, useOrganization } from "@clerk/nextjs";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isLoaded } = useAuth();
  const { organization } = useOrganization();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <header className="flex h-16 items-center gap-4 border-b bg-muted/40 px-6">
          <SidebarTrigger />
          <div className="flex items-center gap-4 ml-auto">
            {organization && (
              <div className="text-sm font-medium">{organization.name}</div>
            )}
            <UserButton />
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}