import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CollaborativeEditor } from "@/components/editor";
import { useQuery } from "@tanstack/react-query";
import type { Document } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { RefreshCw, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ConsoleLog, type LogEntry } from "@/components/console-log";
import { useState } from "react";
import { DownloadButton } from "@/components/download-button";
import { motion } from "framer-motion"; // Added import for Framer Motion


export default function Editor() {
  const { toast } = useToast();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isAnimating, setIsAnimating] = useState(false); // Added animation state
  const { data: doc, isLoading, refetch } = useQuery<Document>({
    queryKey: ["/api/document/1"],
  });

  const addLog = (message: string, type: "success" | "error") => {
    setLogs(prev => [...prev, { message, type, timestamp: new Date() }]);
  };

  const handlePull = async () => {
    try {
      await refetch();
      addLog("Successfully pulled latest changes", "success");
      toast({
        title: "Changes pulled",
        description: "Document has been updated with the latest changes.",
      });
    } catch (error) {
      addLog("Failed to pull changes", "error");
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
      addLog("Successfully pushed changes", "success");
      toast({
        title: "Changes pushed",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      addLog("Failed to push changes", "error");
      toast({
        variant: "destructive",
        title: "Failed to push changes",
        description: "Please try again later.",
      });
    }
  };

  return (
    <motion.div // Wrapped the entire div in motion.div for animation
      className="min-h-screen bg-background relative overflow-hidden origin-center" // Added origin-center
      animate={isAnimating ? {
        rotateX: [0, 45, 90],
        rotateY: [0, -45, -90],
        scale: [1, 0.8, 0.5],
        opacity: [1, 0.8, 0],
      } : {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        opacity: 1,
      }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-primary/20 animate-gradient-slow pointer-events-none" />

      <div className="relative p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Collaborative Editor
            </h1>
            <div className="flex gap-2">
              <DownloadButton />
              <Button
                variant="outline"
                size="sm"
                onClick={handlePull}
                className="gap-2 transition-transform hover:scale-105 active:scale-95"
              >
                <RefreshCw className="h-4 w-4 transition-transform hover:rotate-180" />
                Pull Changes
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handlePush}
                className="gap-2 transition-transform hover:scale-105 active:scale-95"
              >
                <Upload className="h-4 w-4 transition-transform hover:-translate-y-1" />
                Push Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsAnimating(!isAnimating)} //Added button to trigger animation
              >
                Fold/Unfold
              </Button>
            </div>
          </div>

          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full mb-2">
                Toggle Editor
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
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

              <ConsoleLog logs={logs} />
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </motion.div>
  );
}