import { QuoteRequestForm } from "@/components/quote-request-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewQuoteRequestPage() {
  return (
    <div className="container mx-auto max-w-3xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>New AI Quote Request</CardTitle>
        </CardHeader>
        <CardContent>
          <QuoteRequestForm />
        </CardContent>
      </Card>
    </div>
  );
}