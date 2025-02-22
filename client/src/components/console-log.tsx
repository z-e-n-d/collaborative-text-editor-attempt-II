import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";

export interface LogEntry {
  message: string;
  type: "success" | "error";
  timestamp: Date;
}

interface ConsoleLogProps {
  logs: LogEntry[];
}

export function ConsoleLog({ logs }: ConsoleLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <ScrollArea className="h-32 rounded-md border bg-black/80 backdrop-blur-sm p-4">
      <div ref={scrollRef} className="space-y-2 font-mono text-sm">
        {logs.map((log, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-muted-foreground">
              {log.timestamp.toLocaleTimeString()}
            </span>
            <span className={log.type === "success" ? "text-green-400" : "text-red-400"}>
              {log.message}
            </span>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
