import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Leads from "./pages/Leads";
import Quotes from "./pages/Quotes";
import Jobs from "./pages/Jobs";
import NewJob from "./pages/NewJob";
import Invoices from "./pages/Invoices";
import Customers from "./pages/Customers";
import Customer from "./pages/Customer";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/quotes" element={<Quotes />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/new" element={<NewJob />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/:id" element={<Customer />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </TooltipProvider>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;