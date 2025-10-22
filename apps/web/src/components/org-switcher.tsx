import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Building, PlusCircle } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

type Org = {
  id: string;
  name: string;
};

export default function OrgSwitcher({
  userOrgs,
  activeOrg,
}: {
  userOrgs: Org[];
  activeOrg: Org;
}) {
  const switchOrg = async (formData: FormData) => {
    "use server";
    const orgId = formData.get("orgId") as string;
    if (orgId) {
      cookies().set("active-org-id", orgId, {
        httpOnly: true,
        path: "/",
      });
      redirect("/dashboard");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-48 justify-between">
          <div className="flex items-center gap-2 truncate">
            <Building className="h-4 w-4" />
            <span className="truncate">{activeOrg.name}</span>
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel>Organizations</DropdownMenuLabel>
        {userOrgs.map((org) => (
          <DropdownMenuItem key={org.id} asChild className="p-0">
            <form action={switchOrg} className="w-full">
              <input type="hidden" name="orgId" value={org.id} />
              <button
                type="submit"
                className="w-full text-left px-2 py-1.5 text-sm"
                disabled={org.id === activeOrg.id}
              >
                {org.name}
              </button>
            </form>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          {/* This will eventually link to a /create-organization page */}
          <Link href="#" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>Create Organization</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}