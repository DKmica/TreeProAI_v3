import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Customers = () => {
  return (
    <Layout>
      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage your customer database here.</p>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Customers;