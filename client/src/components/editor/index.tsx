import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { MenuBar } from "./menu-bar";
import { useCallback, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import debounce from "lodash/debounce";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";

interface EditorProps {
  initialContent: string;
}

export function CollaborativeEditor({ initialContent }: EditorProps) {
  const { toast } = useToast();

  const saveMutation = useMutation({
    mutationFn: async (content: string) => {
      await apiRequest("POST", "/api/document/1", { content });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to save changes",
        description: "Your changes could not be saved. Please try again.",
      });
    },
  });

  const debouncedSave = useCallback(
    debounce((content: string) => {
      saveMutation.mutate(content);
    }, 1000),
    []
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Youtube.configure({
        controls: true,
        modestBranding: true,
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      debouncedSave(content);
    },
  });

  useEffect(() => {
    if (saveMutation.isSuccess) {
      queryClient.invalidateQueries({ queryKey: ["/api/document/1"] });
    }
  }, [saveMutation.isSuccess]);

  if (!editor) return null;

  return (
    <div className="space-y-4">
      <MenuBar editor={editor} />
      <EditorContent 
        editor={editor} 
        className="prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none"
      />
    </div>
  );
}