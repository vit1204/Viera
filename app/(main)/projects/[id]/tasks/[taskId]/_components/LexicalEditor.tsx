"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import {
  HeadingNode,
  QuoteNode,
} from "@lexical/rich-text";
import { LinkNode, AutoLinkNode } from "@lexical/link";
import { EditorState } from "lexical";
import type { LexicalEditor } from "lexical";

interface LexicalEditorProps {
  initialValue?: string;
  onChange?: (content: string) => void;
  readOnly?: boolean;
}

const theme = {
  root: "editor-root relative text-foreground",
  content: "editor-content p-4 min-h-32 outline-none",
  paragraph: "editor-paragraph m-0 relative",
  heading: {
    h1: "text-2xl font-bold mb-2",
    h2: "text-xl font-bold mb-2",
    h3: "text-lg font-bold mb-2",
  },
  quote: "border-l-4 border-primary pl-4 text-foreground/80 italic my-2",
  link: "text-primary underline cursor-pointer hover:text-primary/80",
};

export default function LexicalEditorComponent({
  initialValue,
  onChange,
  readOnly = false,
}: LexicalEditorProps) {
  const initialConfig = {
    namespace: "TaskEditor",
    theme,
    nodes: [HeadingNode, QuoteNode, LinkNode, AutoLinkNode],
    onError: (error: Error) => {
      console.error("[v0] Lexical error:", error);
    },
    editable: !readOnly,
  };

  const handleChange = (editorState: EditorState, editor: LexicalEditor) => {
    editorState.read(() => {
      const text = editor.getEditorState().read(() => {
        return editor.getRootElement()?.textContent || "";
      });
      onChange?.(text);
    });
  };

  return (
    <LexicalComposer initialConfig={initialConfig as any}>
      <div
        className={`relative rounded-md border border-border bg-input/30 ${
          readOnly ? "bg-muted/30" : ""
        }`}
      >
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="editor-content p-4 min-h-32 outline-none text-sm" />
          }
          placeholder={
            <div className="pointer-events-none absolute top-4 left-4 text-muted-foreground text-sm">
              Add a description...
            </div>
          }
          ErrorBoundary={() => <div>Error in editor</div>}
        />
        <HistoryPlugin />
        <OnChangePlugin onChange={handleChange} />
      </div>
    </LexicalComposer>
  );
}
