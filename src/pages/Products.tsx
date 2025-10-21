import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Products = () => {
  return (
    <Layout>
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage your products and services here.</p>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Products;