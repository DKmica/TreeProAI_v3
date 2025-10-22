import Layout from "@/components/layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Quotes = () => {
  return (
    <Layout>
      <Card>
        <CardHeader>
          <CardTitle>Quotes</CardTitle>
          <CardDescription>
            Create and manage your price estimates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold">Quotes Table Coming Soon</h3>
            <p className="text-muted-foreground">
              A table of all your quotes with statuses and actions will be here.
            </p>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Quotes;