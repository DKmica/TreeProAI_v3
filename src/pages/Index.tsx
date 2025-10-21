import Layout from "@/components/layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Index = () => {
  return (
    <Layout>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Welcome to TreeProAI</CardTitle>
            <CardDescription>
              Here's a quick overview of your business.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Your main dashboard content will go here. We can start adding charts, recent activity, and key metrics.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;