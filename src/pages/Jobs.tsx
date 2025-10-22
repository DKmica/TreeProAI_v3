import Layout from "@/components/layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Jobs = () => {
  return (
    <Layout>
      <Card>
        <CardHeader>
          <CardTitle>Jobs</CardTitle>
          <CardDescription>
            Schedule and manage your upcoming work.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold">Job Scheduler Coming Soon</h3>
            <p className="text-muted-foreground">
              A map view with crew assignments and weather info will be here.
            </p>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Jobs;