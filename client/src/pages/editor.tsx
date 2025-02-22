import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CollaborativeEditor } from "@/components/editor";
import { useQuery } from "@tanstack/react-query";
import type { Document } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { RefreshCw, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Editor() {
  const { toast } = useToast();
  const { data: doc, isLoading, refetch } = useQuery<Document>({
    queryKey: ["/api/document/1"],
  });

  const handlePull = async () => {
    try {
      await refetch();
      toast({
        title: "Changes pulled",
        description: "Document has been updated with the latest changes.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to pull changes",
        description: "Please try again later.",
      });
    }
  };

  const handlePush = async () => {
    try {
      await queryClient.invalidateQueries({ queryKey: ["/api/document/1"] });
      toast({
        title: "Changes pushed",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to push changes",
        description: "Please try again later.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-primary/20 animate-gradient-slow pointer-events-none" />

      <div className="relative p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Collaborative Editor
            </h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePull}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Pull Changes
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handlePush}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Push Changes
              </Button>
            </div>
          </div>

          <Card className="border border-primary/20 bg-card/95 backdrop-blur-sm">
            <div className="p-4">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-32 w-full" />
                </div>
              ) : (
                <CollaborativeEditor initialContent={doc?.content || ""} />
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}