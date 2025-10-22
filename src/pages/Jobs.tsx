import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import AssignCrewModal from "@/components/jobs/AssignCrewModal";
import JobsMap from "@/components/jobs/JobsMap";

const mockJobs = [
  {
    id: "job_1",
    customerName: "John Doe",
    address: "123 Main St, Anytown, USA",
    date: "2023-11-05",
    status: "Scheduled",
    crew: "Crew A",
    lat: 34.0522,
    lon: -118.2437,
  },
  {
    id: "job_2",
    customerName: "Alice Johnson",
    address: "456 Oak Ave, Anytown, USA",
    date: "2023-11-06",
    status: "In Progress",
    crew: "Crew B",
    lat: 34.06,
    lon: -118.25,
  },
  {
    id: "job_3",
    customerName: "Sam Wilson",
    address: "789 Pine Ln, Anytown, USA",
    date: "2023-11-08",
    status: "Completed",
    crew: "Crew A",
    lat: 34.045,
    lon: -118.23,
  },
  {
    id: "job_4",
    customerName: "Emily Davis",
    address: "101 Maple Dr, Anytown, USA",
    date: "2023-11-10",
    status: "Scheduled",
    crew: "Not Assigned",
    lat: 34.065,
    lon: -118.26,
  },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Completed":
      return "success";
    case "In Progress":
      return "default";
    case "Scheduled":
      return "secondary";
    default:
      return "outline";
  }
};

const Jobs = () => {
  const [isAssignCrewModalOpen, setIsAssignCrewModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<(typeof mockJobs)[0] | null>(
    null,
  );

  const handleAssignCrewClick = (job: (typeof mockJobs)[0]) => {
    setSelectedJob(job);
    setIsAssignCrewModalOpen(true);
  };

  const handleAssignSuccess = () => {
    setIsAssignCrewModalOpen(false);
    setSelectedJob(null);
    // In a real app, we would refetch the jobs data here.
  };

  return (
    <Layout>
      <Tabs defaultValue="list">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Jobs</h2>
            <p className="text-muted-foreground">
              Schedule and manage your upcoming work.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <TabsList>
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="map">Map</TabsTrigger>
            </TabsList>
            <Button asChild>
              <Link to="/jobs/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Job
              </Link>
            </Button>
          </div>
        </div>
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>All Jobs</CardTitle>
              <CardDescription>
                A list of all jobs in the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Address
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                    <TableHead>Crew</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">
                        {job.customerName}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {job.address}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {new Date(job.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{job.crew}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(job.status)}>
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAssignCrewClick(job)}
                            >
                              Assign Crew
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Mark as Complete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="map">
          <Card>
            <CardHeader>
              <CardTitle>Map View</CardTitle>
              <CardDescription>
                A map of all your scheduled jobs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <JobsMap jobs={mockJobs} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <AssignCrewModal
        isOpen={isAssignCrewModalOpen}
        onOpenChange={setIsAssignCrewModalOpen}
        job={selectedJob}
        onSuccess={handleAssignSuccess}
      />
    </Layout>
  );
};

export default Jobs;