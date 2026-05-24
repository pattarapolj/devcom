"use client";

import {
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    thematicBreakPlugin,
    markdownShortcutPlugin,
    MDXEditor,
    type MDXEditorMethods,
    ConditionalContents,
    ChangeCodeMirrorLanguage,
    toolbarPlugin,
    UndoRedo,
    Separator,
    BoldItalicUnderlineToggles,
    ListsToggle,
    CreateLink,
    InsertImage,
    InsertTable,
    InsertThematicBreak,
    InsertCodeBlock,
    linkPlugin,
    linkDialogPlugin,
    tablePlugin,
    imagePlugin,
    codeBlockPlugin,
    codeMirrorPlugin,
    diffSourcePlugin,
} from "@mdxeditor/editor";
import { basicDark } from "cm6-theme-basic-dark";
import { useTheme } from "next-themes";

import "@mdxeditor/editor/style.css";

import "@/components/editor/dark-editor.css";

interface Props {
    value: string;
    editorRef: React.Ref<MDXEditorMethods> | null;
    fieldChange: (value: string) => void;
}

const Editor = ({ value, editorRef, fieldChange }: Props) => {
    const { resolvedTheme } = useTheme();

    const theme = resolvedTheme === "dark" ? [basicDark] : [];

    return (
        <MDXEditor
            key={resolvedTheme}
            markdown={value}
            ref={editorRef}
            className="background-light800_dark200 light-border-2 markdown-editor dark-editor grid w-full rounded-1.5"
            contentEditableClassName="min-h-[280px] p-4"
            onChange={fieldChange}
            plugins={[
                headingsPlugin(),
                listsPlugin(),
                linkPlugin(),
                linkDialogPlugin(),
                quotePlugin(),
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
                    toolbarContents: () => (
                        <ConditionalContents
                            options={[
                                {
                                    when: (editor) =>
                                        editor?.editorType === "codeblock",
                                    contents: () => (
                                        <ChangeCodeMirrorLanguage />
                                    ),
                                },
                                {
                                    fallback: () => (
                                        <>
                                            <UndoRedo />
                                            <Separator />

                                            <BoldItalicUnderlineToggles />
                                            <Separator />

                                            <ListsToggle />
                                            <Separator />

                                            <CreateLink />
                                            <InsertImage />
                                            <Separator />

                                            <InsertTable />
                                            <InsertThematicBreak />

                                            <InsertCodeBlock />
                                        </>
                                    ),
                                },
                            ]}
                        />
                    ),
                }),
            ]}
        />
    );
};

export default Editor;
