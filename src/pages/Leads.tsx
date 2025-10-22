import { useState, useEffect, useCallback } from "react";
import Layout from "@/components/layout/Layout";
import LeadCard from "@/components/leads/LeadCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NewLeadForm from "@/components/leads/NewLeadForm";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

type Lead = {
  id: string;
  score: number;
  customers: {
    name: string;
    email: string;
  } | null;
};

const Leads = () => {
  const [isNewLeadDialogOpen, setIsNewLeadDialogOpen] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("id, score, customers(name, email)")
      .order("created_at", { ascending: false });

    if (error) {
      showError(error.message);
      setLeads([]);
    } else {
      setLeads(data as unknown as Lead[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleSuccess = () => {
    setIsNewLeadDialogOpen(false);
    fetchLeads();
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Leads</h2>
          <p className="text-muted-foreground">
            Manage your potential customers and new opportunities.
          </p>
        </div>
        <Dialog open={isNewLeadDialogOpen} onOpenChange={setIsNewLeadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Lead</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new lead.
              </DialogDescription>
            </DialogHeader>
            <NewLeadForm onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : leads.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-semibold">No leads yet</h3>
          <p className="text-muted-foreground mt-2">
            Click "New Lead" to get started.
          </p>
        </div>
      )}
    </Layout>
  );
};

const CardSkeleton = () => (
  <Card>
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  </Card>
);

export default Leads;