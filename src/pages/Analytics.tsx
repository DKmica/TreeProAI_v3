import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";

const revenueData = [
  { month: "Jan", revenue: 18621 },
  { month: "Feb", revenue: 30543 },
  { month: "Mar", revenue: 23598 },
  { month: "Apr", revenue: 45231 },
  { month: "May", revenue: 29876 },
  { month: "Jun", revenue: 51098 },
];

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const leadsData = [
  { date: "01/06", leads: 12 },
  { date: "02/06", leads: 15 },
  { date: "03/06", leads: 11 },
  { date: "04/06", leads: 18 },
  { date: "05/06", leads: 22 },
  { date: "06/06", leads: 20 },
  { date: "07/06", leads: 25 },
];

const leadsChartConfig = {
  leads: {
    label: "New Leads",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const Analytics = () => {
  return (
    <Layout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Analytics</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
              <CardDescription>
                Showing revenue for the last 6 months.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={revenueChartConfig} className="min-h-[200px] w-full">
                <BarChart accessibilityLayer data={revenueData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <YAxis
                    tickFormatter={(value) => `$${value / 1000}k`}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" radius={8} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>New Leads</CardTitle>
              <CardDescription>
                Showing new leads from the last 7 days.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={leadsChartConfig} className="min-h-[200px] w-full">
                <LineChart accessibilityLayer data={leadsData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Line
                    dataKey="leads"
                    type="natural"
                    stroke="var(--color-leads)"
                    strokeWidth={2}
                    dot={true}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;