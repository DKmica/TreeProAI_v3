import Layout from "@/components/layout/Layout";
import LeadCard from "@/components/leads/LeadCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const mockLeads = [
  {
    id: "lead_1",
    name: "John Doe",
    email: "john.doe@example.com",
    score: 85,
  },
  {
    id: "lead_2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    score: 60,
  },
  {
    id: "lead_3",
    name: "Sam Wilson",
    email: "sam.wilson@example.com",
    score: 30,
  },
  {
    id: "lead_4",
    name: "Alice Johnson",
    email: "alice.j@example.com",
    score: 95,
  },
  {
    id: "lead_5",
    name: "Bob Brown",
    email: "bob.b@example.com",
    score: 45,
  },
  {
    id: "lead_6",
    name: "Charlie Davis",
    email: "charlie.d@example.com",
    score: 70,
  },
];

const Leads = () => {
  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Leads</h2>
          <p className="text-muted-foreground">
            Manage your potential customers and new opportunities.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Lead
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {mockLeads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </div>
    </Layout>
  );
};

export default Leads;