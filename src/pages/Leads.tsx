import Layout from "@/components/layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Leads = () => {
  return (
    <Layout>
      <Card>
        <CardHeader>
          <CardTitle>Leads</CardTitle>
          <CardDescription>
            Manage your potential customers and new opportunities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold">Leads Grid Coming Soon</h3>
            <p className="text-muted-foreground">
              A grid view of leads with scoring badges and quick actions will be here.
            </p>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Leads;