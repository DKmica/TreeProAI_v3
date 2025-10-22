import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

const getScoreVariant = (score: number) => {
  if (score > 75) return "destructive";
  if (score > 50) return "default";
  return "secondary";
};

const LeadCard = ({
  lead,
}: {
  lead: { id: string; name: string; email: string; score: number };
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback>
              {lead.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{lead.name}</CardTitle>
            <CardDescription>{lead.email}</CardDescription>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Edit Lead</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Archive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Lead Score</p>
          <Badge variant={getScoreVariant(lead.score)}>{lead.score}</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/quotes/new?leadId=${lead.id}`}>Create Quote</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LeadCard;