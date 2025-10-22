import { useState, useEffect, useCallback } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { Skeleton } from "@/components/ui/skeleton";

type Job = {
  id: string;
  customer_name: string;
  address: string;
  date: string;
  status: string;
  crew_id: string | null;
  lat: number | null;
  lon: number | null;
  crews: {
    id: string;
    name: string;
  } | null;
};

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
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("jobs")
      .select("*, crews(id, name)")
      .order("date", { ascending: true });

    if (error) {
      showError(error.message);
      setJobs([]);
    } else {
      setJobs(data as Job[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleAssignCrewClick = (job: Job) => {
    setSelectedJob(job);
    setIsAssignCrewModalOpen(true);
  };

  const handleAssignSuccess = () => {
    setIsAssignCrewModalOpen(false);
    setSelectedJob(null);
    fetchJobs();
  };

  const mapJobs = jobs.map(j => ({...j, customerName: j.customer_name})).filter(j => j.lat && j.lon) as any;

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
              {loading ? (
                <TableSkeleton />
              ) : jobs.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead className="hidden md:table-cell">Address</TableHead>
                      <TableHead className="hidden sm:table-cell">Date</TableHead>
                      <TableHead>Crew</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.customer_name}</TableCell>
                        <TableCell className="hidden md:table-cell">{job.address}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {new Date(job.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{job.crews?.name || "Not Assigned"}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(job.status)}>{job.status}</Badge>
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
                              <DropdownMenuItem onClick={() => handleAssignCrewClick(job)}>
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
              ) : (
                <div className="text-center py-16">
                  <h3 className="text-xl font-semibold">No jobs yet</h3>
                  <p className="text-muted-foreground mt-2">
                    Click "New Job" to schedule your first job.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="map">
          <Card>
            <CardHeader>
              <CardTitle>Map View</CardTitle>
              <CardDescription>A map of all your scheduled jobs.</CardDescription>
            </CardHeader>
            <CardContent>
              <JobsMap jobs={mapJobs} />
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

const TableSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
  </div>
);

export default Jobs;