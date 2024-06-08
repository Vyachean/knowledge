<script setup lang="ts">
import { watch, shallowRef, onBeforeUnmount, watchEffect } from 'vue';
import type { Transaction } from 'prosemirror-state';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { history, undo, redo } from 'prosemirror-history';
import {
  defaultMarkdownParser as markdownParser,
  defaultMarkdownSerializer as markdownSerializer,
  schema,
} from 'prosemirror-markdown';
import { useVModel } from '@vueuse/core';
import { isUndefined } from 'lodash-es';
import EditorBar from './EditorBar.vue';

const refView = shallowRef<HTMLDivElement>();
const editorView = shallowRef<EditorView>();

const props = defineProps<{
  // eslint-disable-next-line vue/no-unused-properties -- используется в useVModel
  markdown: string;
}>();

const emit = defineEmits<{
  'update:markdown': [markdown: string];
}>();

const contentMarkdownState = useVModel(props, 'markdown', emit);

const createEditorState = (contentMarkdown: string) => {
  return EditorState.create({
    doc: markdownParser.parse(contentMarkdown),
    schema,
    plugins: [
      history(),
      keymap({
        'Mod-z': undo,
        'Shift-Mod-z': redo,
        ...baseKeymap,
      }),
    ],
  });
};

const editorState = createEditorState(contentMarkdownState.value);

const dispatchTransaction = (transaction: Transaction) => {
  if (editorView.value) {
    const newState = editorView.value.state.apply(transaction);
    editorView.value.updateState(newState);
    contentMarkdownState.value = markdownSerializer.serialize(newState.doc);
  }
};

watch(
  refView,
  (newRefView) => {
    if (newRefView) {
      editorView.value = new EditorView(newRefView, {
        state: editorState,
        dispatchTransaction,
      });
    } else {
      editorView.value?.destroy();
    }
  },
  { immediate: true },
);

watchEffect(() => {
  if (!isUndefined(contentMarkdownState.value) && editorView.value) {
    const currentState = markdownSerializer.serialize(
      editorView.value.state.doc,
    );
    if (currentState !== contentMarkdownState.value) {
      editorView.value.updateState(
        createEditorState(contentMarkdownState.value),
      );
    }
  }
});

onBeforeUnmount(() => {
  editorView.value?.destroy();
});
</script>

<template>
  <div class="editor">
    <EditorBar
      v-if="editorView"
      class="editor__panel"
      :editor-view="editorView"
    />

    <div ref="refView" class="content editor__input-area textarea" />

    <pre class="editor__code">{{ contentMarkdownState }}</pre>
  </div>
</template>

<style lang="scss">
@use 'bulma/sass/base';
@use 'bulma/sass/themes';
@use 'bulma/sass/helpers/spacing';
@use 'bulma/sass/elements/content';
@use 'bulma/sass/form/input-textarea';
@use 'bulma/sass/elements/button';
</style>

<style lang="scss" scoped>
.editor {
  display: grid;
  grid-template:
    'panel panel'
    'input-area code';

  &__panel {
    grid-area: panel;
  }

  &__input-area {
    grid-area: input-area;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    align-items: stretch;
    > * {
      flex-grow: 1;
      &:focus {
        outline: none;
      }
    }
  }

  &__code {
    grid-area: code;
  }
}
</style>
