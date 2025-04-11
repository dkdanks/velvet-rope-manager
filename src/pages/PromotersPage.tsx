
import React from "react";
import AppLayout from "@/components/layouts/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { mockUsers } from "@/lib/mockData";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const PromotersPage: React.FC = () => {
  const promoters = mockUsers.filter(user => user.role === "promoter");
  const { toast } = useToast();
  
  const handleAddPromoter = () => {
    // In a real app, this would open a form to add a new promoter
    toast({
      title: "Feature not available",
      description: "Adding new promoters is not available in the demo.",
    });
  };

  return (
    <AppLayout requireRole="venue">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold">Promoters</h1>
          <Button onClick={handleAddPromoter}>
            <Plus className="mr-2 h-4 w-4" /> Add Promoter
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promoters.map((promoter) => (
            <Card key={promoter.id}>
              <CardHeader className="pb-2">
                <CardTitle>{promoter.name}</CardTitle>
                <CardDescription>{promoter.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">Promoter</span>
                  </div>
                  <Button variant="ghost" asChild>
                    <Link to={`/guest-lists?promoter=${promoter.id}`}>
                      View Guest Lists
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default PromotersPage;
