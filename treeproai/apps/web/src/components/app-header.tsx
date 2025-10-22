import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

export function AppHeader() {
  return (
    <header className="flex h-16 items-center justify-end gap-4 border-b bg-background px-6">
      <OrganizationSwitcher />
      <UserButton />
    </header>
  );
}