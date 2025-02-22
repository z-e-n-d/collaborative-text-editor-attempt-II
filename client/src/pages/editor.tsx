import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CollaborativeEditor } from "@/components/editor";
import { useQuery } from "@tanstack/react-query";
import type { Document } from "@shared/schema";

export default function Editor() {
  const { data: doc, isLoading } = useQuery<Document>({
    queryKey: ["/api/document/1"],
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Collaborative Editor
        </h1>
        <Card className="p-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <CollaborativeEditor initialContent={doc?.content || ""} />
          )}
        </Card>
      </div>
    </div>
  );
}
