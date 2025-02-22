import { type Editor } from "@tiptap/react";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import { useState, useRef } from "react";

interface MenuBarProps {
  editor: Editor;
}

export function MenuBar({ editor }: MenuBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploadingImage(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          editor.chain().focus().setImage({ src: e.target.result }).run();
        }
        setIsUploadingImage(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoInsert = () => {
    const url = prompt('Enter YouTube URL');
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  return (
    <div className="flex items-center gap-1 flex-wrap">
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        aria-label="Bold"
      >
        <Bold className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        aria-label="Italic"
      >
        <Italic className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        aria-label="Bullet List"
      >
        <List className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        aria-label="Ordered List"
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("blockquote")}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
        aria-label="Quote"
      >
        <Quote className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageUpload}
      />

      <Toggle
        size="sm"
        pressed={isUploadingImage}
        onPressedChange={() => fileInputRef.current?.click()}
        aria-label="Upload Image"
      >
        <ImageIcon className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={false}
        onPressedChange={handleVideoInsert}
        aria-label="Insert Video"
      >
        <Video className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Toggle
        size="sm"
        pressed={false}
        onPressedChange={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        aria-label="Undo"
      >
        <Undo className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={false}
        onPressedChange={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        aria-label="Redo"
      >
        <Redo className="h-4 w-4" />
      </Toggle>
    </div>
  );
}