import {
  Home,
  LineChart,
  Package,
  Package2,
  Settings,
  ShoppingCart,
  Users2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const NavItem = ({ to, icon: Icon, label }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <NavLink
        to={to}
        end
        className={({ isActive }) =>
          cn(
            "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
            isActive && "bg-accent text-accent-foreground"
          )
        }
      >
        <Icon className="h-5 w-5" />
        <span className="sr-only">{label}</span>
      </NavLink>
    </TooltipTrigger>
    <TooltipContent side="right">{label}</TooltipContent>
  </Tooltip>
);

const Sidebar = () => {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <NavLink
          to="/"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">TreeProAI</span>
        </NavLink>
        <NavItem to="/" icon={Home} label="Dashboard" />
        <NavItem to="/orders" icon={ShoppingCart} label="Orders" />
        <NavItem to="/products" icon={Package} label="Products" />
        <NavItem to="/customers" icon={Users2} label="Customers" />
        <NavItem to="/analytics" icon={LineChart} label="Analytics" />
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <NavItem to="/settings" icon={Settings} label="Settings" />
      </nav>
    </aside>
  );
};

export default Sidebar;