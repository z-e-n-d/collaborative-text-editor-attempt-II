import { type Extensions } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export const defaultExtensions: Extensions = [
  StarterKit.configure({
    bulletList: {
      HTMLAttributes: {
        class: "list-disc list-outside leading-3 ml-4",
      },
    },
    orderedList: {
      HTMLAttributes: {
        class: "list-decimal list-outside leading-3 ml-4",
      },
    },
    blockquote: {
      HTMLAttributes: {
        class: "border-l-4 border-primary pl-4",
      },
    },
  }),
];
