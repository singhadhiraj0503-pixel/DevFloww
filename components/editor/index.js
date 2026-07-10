"use client";
// InitializedMDXEditor.tsx
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  UndoRedo,
  BoldItalicUnderlineToggles,
  toolbarPlugin,
  Separator,
  ListsToggle,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  linkPlugin,
  linkDialogPlugin,
  tablePlugin,
  imagePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  InsertCodeBlock,
} from "@mdxeditor/editor";
import { basicDark } from "cm6-theme-basic-dark";
import "@mdxeditor/editor/style.css";
import { useTheme } from "next-themes";

const Editor = ({ value, editorRef, fieldChange, ...props }) => {
  const { resolvedTheme } = useTheme();

  const theme = resolvedTheme === "dark" ? [basicDark] : [];

  return (
    <MDXEditor
      className="custom-mdx-editor border-2 h-[300px] rounded overflow-y-auto"
      key={resolvedTheme}
      markdown={value}
      onChange={fieldChange}
      ref={editorRef}
      plugins={[
        // Example Plugin Usage
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        tablePlugin(),
        imagePlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: "" }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            css: "css",
            txt: "txt",
            sql: "sql",
            html: "html",
            saas: "saas",
            scss: "scss",
            bash: "bash",
            json: "json",
            js: "javascript",
            ts: "typescript",
            "": "unspecified",
            tsx: "TypeScript (React)",
            jsx: "JavaScript (React)",
          },
          autoLoadLanguageSupport: true,
          codeMirrorExtensions: theme,
        }),
        diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "" }),
        toolbarPlugin({
          toolbarClassName: "",
          toolbarContents: () => (
            <>
              <UndoRedo />
              <Separator />
              <BoldItalicUnderlineToggles />
              <Separator />
              <ListsToggle />
              <Separator />
              <CreateLink />
              <InsertImage />
              <InsertTable />
              <InsertThematicBreak />
              <InsertCodeBlock />
            </>
          ),
        }),
      ]}
      {...props}
    />
  );
};

export default Editor;
