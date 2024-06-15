<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { useTiptap } from './tiptap';
import TipTapEditorBar from './TipTapEditorBar.vue';

const props = defineProps<{
  // eslint-disable-next-line vue/no-unused-properties -- используется в useVModel
  markdown: string;
}>();

const emit = defineEmits<{
  'update:markdown': [markdown: string];
  modS: [];
}>();

const contentMarkdownState = useVModel(props, 'markdown', emit);

const { tiptapEditor, EditorContentArea } = useTiptap(contentMarkdownState);
</script>

<template>
  <div class="editor">
    <TipTapEditorBar
      v-if="tiptapEditor"
      class="editor__panel"
      :editor="tiptapEditor"
    />

    <EditorContentArea
      :editor="tiptapEditor"
      class="content editor__input-area textarea"
    />

    <pre class="editor__code">{{ contentMarkdownState }}</pre>
  </div>
</template>

<style lang="scss" scoped>
@use 'bulma/sass/form/checkbox-radio';

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
    --bulma-textarea-max-height: auto;
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

    :deep() {
      li[data-checked] {
        display: flex;
        gap: 8px;

        input[type='checkbox'] {
          width: 1.25em;
          height: 1.25em;
        }

        > {
          label,
          div {
            @extend %checkbox-radio;
            cursor: auto;
          }
        }
      }
    }
  }

  &__code {
    grid-area: code;
  }
}
</style>
