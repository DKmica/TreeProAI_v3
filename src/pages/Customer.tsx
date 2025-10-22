import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, Mail, Phone, Bot } from "lucide-react";

const mockCustomerData = {
  cust_1: {
    name: "Liam Johnson",
    email: "liam@example.com",
    phone: "555-123-4567",
    totalSpend: 1250.0,
    joined: "2023-01-15",
  },
  cust_2: {
    name: "Olivia Smith",
    email: "olivia@example.com",
    phone: "555-987-6543",
    totalSpend: 850.5,
    joined: "2023-02-20",
  },
  cust_3: {
    name: "Noah Williams",
    email: "noah@example.com",
    phone: "555-246-8135",
    totalSpend: 2300.0,
    joined: "2023-03-10",
  },
};

const mockJobHistory = [
  {
    id: "job_1",
    date: "2023-05-20",
    service: "Tree Removal",
    amount: 800,
    status: "Completed",
  },
  {
    id: "job_2",
    date: "2023-09-10",
    service: "Stump Grinding",
    amount: 450,
    status: "Completed",
  },
];

const Customer = () => {
  const { id } = useParams();
  const customer = mockCustomerData[id as keyof typeof mockCustomerData];

  if (!customer) {
    return (
      <Layout>
        <div className="text-center py-12">Customer not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link to="/customers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Customers
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{customer.name}</CardTitle>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.phone}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div>
                <strong>Total Spend:</strong>{" "}
                {customer.totalSpend.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </div>
              <div>
                <strong>Customer Since:</strong>{" "}
                {new Date(customer.joined).toLocaleDateString()}
              </div>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bot className="h-5 w-5" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                AI-powered insights about this customer will appear here, such
                as potential for upsell, churn risk, or recommended services.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Tabs defaultValue="history">
            <TabsList>
              <TabsTrigger value="history">Job History</TabsTrigger>
              <TabsTrigger value="communication">Communication Log</TabsTrigger>
            </TabsList>
            <TabsContent value="history" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Job History</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockJobHistory.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell>
                            {new Date(job.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{job.service}</TableCell>
                          <TableCell>
                            <Badge variant="success">{job.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {job.amount.toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                            })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="communication" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Communication Log</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    A log of emails, calls, and notes related to this customer
                    will appear here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Customer;