import { useState, useEffect, useCallback } from "react";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import Layout from "@/components/layout/Layout";
import NewCustomerForm from "@/components/NewCustomerForm";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { Skeleton } from "@/components/ui/skeleton";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
};

const Customers = () => {
  const [isNewCustomerDialogOpen, setIsNewCustomerDialogOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("customers")
      .select("id, name, email, phone")
      .order("created_at", { ascending: false });

    if (error) {
      showError(error.message);
      setCustomers([]);
    } else {
      setCustomers(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSuccess = () => {
    setIsNewCustomerDialogOpen(false);
    fetchCustomers();
  };

  const handleDelete = async (customerId: string) => {
    const { error } = await supabase.from("customers").delete().eq("id", customerId);
    if (error) {
      showError(error.message);
    } else {
      showSuccess("Customer deleted.");
      fetchCustomers();
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">
            Manage your customer relationships and view their history.
          </p>
        </div>
        <Dialog
          open={isNewCustomerDialogOpen}
          onOpenChange={setIsNewCustomerDialogOpen}
        >
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Customer</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new customer.
              </DialogDescription>
            </DialogHeader>
            <NewCustomerForm onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
          <CardDescription>A list of all your customers.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <TableSkeleton />
          ) : customers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Phone</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      <Link
                        to={`/customers/${customer.id}`}
                        className="hover:underline"
                      >
                        {customer.name}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {customer.email}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {customer.phone || "N/A"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(customer.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold">No customers yet</h3>
              <p className="text-muted-foreground mt-2">
                Click "New Customer" to add your first one.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

const TableSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-12 w-full rounded-md" />
    <Skeleton className="h-12 w-full rounded-md" />
    <Skeleton className="h-12 w-full rounded-md" />
  </div>
);

export default Customers;