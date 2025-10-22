import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Index from "./pages/Index";
import Leads from "./pages/Leads";
import Quotes from "./pages/Quotes";
import Jobs from "./pages/Jobs";
import NewJob from "./pages/NewJob";
import Invoices from "./pages/Invoices";
import Customers from "./pages/Customers";
import Customer from "./pages/Customer";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const AppRoutes = () => {
  const { session } = useAuth();

  if (!session) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/leads" element={<Leads />} />
      <Route path="/quotes" element={<Quotes />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/jobs/new" element={<NewJob />} />
      <Route path="/invoices" element={<Invoices />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/customers/:id" element={<Customer />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Router>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </Router>
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;