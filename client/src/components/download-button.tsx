import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, FileIcon } from "lucide-react";
import JSZip from "jszip";
import { Button } from "./ui/button";

export function DownloadButton() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showZip, setShowZip] = useState(false);

  const handleDownload = async () => {
    setIsAnimating(true);
    setShowZip(true);

    // Create zip file
    const zip = new JSZip();
    
    // Add files to zip
    const content = document.querySelector('.ProseMirror')?.innerHTML || '';
    zip.file("content.html", content);
    
    setTimeout(async () => {
      // Generate zip
      const blob = await zip.generateAsync({ type: "blob" });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "collaborative-editor-content.zip";
      
      // Trigger download
      setShowZip(false);
      setTimeout(() => {
        a.click();
        window.URL.revokeObjectURL(url);
        setIsAnimating(false);
      }, 500);
    }, 1500);
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {!isAnimating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              scale: 0.5,
              transition: { duration: 0.2 }
            }}
          >
            <Button
              onClick={handleDownload}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Folder className="h-4 w-4" />
              Download
            </Button>
          </motion.div>
        )}

        {showZip && (
          <motion.div
            initial={{ 
              scale: 0.5,
              y: 0,
              rotateX: 0,
              originY: 0
            }}
            animate={{ 
              scale: 1,
              y: 20,
              rotateX: 180,
              transition: { duration: 0.5 }
            }}
            exit={{
              scale: 0,
              opacity: 0,
              transition: { duration: 0.3 }
            }}
            className="absolute top-0 left-0 bg-primary text-primary-foreground px-3 py-1.5 rounded-md flex items-center gap-2"
          >
            <FileIcon className="h-4 w-4" />
            content.zip
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
