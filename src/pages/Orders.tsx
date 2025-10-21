import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Orders = () => {
  return (
    <Layout>
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage your orders here.</p>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Orders;