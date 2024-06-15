import StarterKit from '@tiptap/starter-kit';
import { Editor, EditorContent } from '@tiptap/vue-3';
import { isFunction, isObject, isString, isUndefined } from 'lodash-es';
import { Markdown } from 'tiptap-markdown';
import type { Ref } from 'vue';
import { onBeforeUnmount, watch } from 'vue';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Youtube from '@tiptap/extension-youtube';
import Typography from '@tiptap/extension-typography'

const getMarkdown = ({ storage }: { storage: Record<string, unknown> }) => {
  if (
    'markdown' in storage &&
    isObject(storage.markdown) &&
    'getMarkdown' in storage.markdown &&
    isFunction(storage.markdown.getMarkdown)
  ) {
    const resultMarkdown: unknown = storage.markdown.getMarkdown();
    if (isString(resultMarkdown)) {
      return resultMarkdown;
    }
  }
};

export const useTiptap = (contentMarkdownState: Ref<string>) => {
  const tiptapEditor = new Editor({
    content: contentMarkdownState.value,
    extensions: [
      StarterKit,
      Markdown.configure({
        html: true, // Allow HTML input/output
        tightLists: true, // No <p> inside <li> in markdown output
        tightListClass: 'tight', // Add class to <ul> allowing you to remove <p> margins when tight
        bulletListMarker: '-', // <li> prefix in markdown output
        linkify: true, // Create links from "https://..." text
        breaks: false, // New lines (\n) in markdown input are converted to <br>
        transformPastedText: false, // Allow to paste markdown text in the editor
        transformCopiedText: true, // Copied text is transformed to markdown
      }),

      Table.configure({
        resizable: false,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Underline,
      Image.configure({
        inline: true,
      }),
      Link,
      TaskList.configure({}),
      TaskItem.configure({}),
      // CodeBlock.configure({
      //   languageClassPrefix: 'lang-',
      // }),
      Youtube,
      Typography,
    ],
    onUpdate: ({ editor }) => {
      const stateMarkdown = contentMarkdownState.value;
      const resultMarkdown = getMarkdown(editor);

      if (!isUndefined(resultMarkdown) && resultMarkdown !== stateMarkdown) {
        contentMarkdownState.value = resultMarkdown;
      }
    },
  });

  watch(contentMarkdownState, (stateMarkdown) => {
    const resultMarkdown = getMarkdown(tiptapEditor);

    if (!isUndefined(resultMarkdown) && resultMarkdown !== stateMarkdown) {
      tiptapEditor.commands.setContent(stateMarkdown);
    }
  });

  onBeforeUnmount(() => {
    tiptapEditor.destroy();
  });

  return {
    tiptapEditor,
    EditorContentArea: EditorContent,
  };
};
