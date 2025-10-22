import Layout from "@/components/layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Invoices = () => {
  return (
    <Layout>
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>
            Track payments and manage your billing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold">Invoice Tracker Coming Soon</h3>
            <p className="text-muted-foreground">
              A list of invoices with payment links and reminders will be here.
            </p>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Invoices;