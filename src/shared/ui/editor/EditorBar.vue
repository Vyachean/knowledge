<script setup lang="ts">
import {
  toggleMark as commandToggleMark,
  setBlockType as commandSetBlockType,
  wrapIn as commandWrapIn,
} from 'prosemirror-commands';
import { schema } from 'prosemirror-markdown';
import type { EditorView } from 'prosemirror-view';
import { ref } from 'vue';
import { vOnClickOutside } from '@vueuse/components';

const props = defineProps<{
  editorView: EditorView;
}>();

const toggleMark = (...markProps: Parameters<typeof commandToggleMark>) =>
  commandToggleMark(...markProps)(
    props.editorView.state,
    props.editorView.dispatch.bind(props.editorView),
  );

const wrapIn = (...wrapProps: Parameters<typeof commandWrapIn>) =>
  commandWrapIn(...wrapProps)(
    props.editorView.state,
    props.editorView.dispatch.bind(props.editorView),
  );

const onClickBlockType = (
  ...bockProps: Parameters<typeof commandSetBlockType>
) => {
  isActiveBlockTypeList.value = false;
  commandSetBlockType(...bockProps)(
    props.editorView.state,
    props.editorView.dispatch.bind(props.editorView),
  );
};

const isActiveBlockTypeList = ref(false);

const onClickOutsideBlockType = () => {
  isActiveBlockTypeList.value = false;
};
</script>

<template>
  <section class="editor__panel field has-addons m-0">
    <div class="control">
      <button
        class="button"
        type="button"
        @click="toggleMark(schema.marks.em)"
        @mousedown.prevent
      >
        <span class="icon is-small"> <i class="fa-solid fa-italic" /> </span>
      </button>
    </div>

    <div class="control">
      <button
        class="button"
        type="button"
        @click="toggleMark(schema.marks.code)"
        @mousedown.prevent
      >
        <span class="icon is-small"><i class="fa-solid fa-code" /></span>
      </button>
    </div>

    <div class="control">
      <button
        class="button"
        type="button"
        @click="toggleMark(schema.marks.strong)"
        @mousedown.prevent
      >
        <span class="icon is-small"><i class="fa-solid fa-bold"></i></span>
      </button>
    </div>

    <div class="control">
      <button
        class="button"
        type="button"
        @click="wrapIn(schema.nodes.bullet_list)"
        @mousedown.prevent
      >
        <span class="icon is-small"><i class="fa-solid fa-list-ul"></i></span>
      </button>
    </div>

    <div class="control">
      <button
        class="button"
        type="button"
        @click="wrapIn(schema.nodes.ordered_list)"
        @mousedown.prevent
      >
        <span class="icon is-small"><i class="fa-solid fa-list-ol"></i></span>
      </button>
    </div>

    <div class="control">
      <button
        class="button"
        type="button"
        @click="wrapIn(schema.nodes.blockquote)"
        @mousedown.prevent
      >
        <span class="icon is-small"><i class="fa-solid fa-quote-left" /></span>
      </button>
    </div>

    <div
      v-on-click-outside="onClickOutsideBlockType"
      class="dropdown control"
      :class="{
        'is-active': isActiveBlockTypeList,
      }"
    >
      <button
        class="button"
        type="button"
        @click="isActiveBlockTypeList = !isActiveBlockTypeList"
        @mousedown.prevent
      >
        <span>BlockType</span>

        <span class="icon is-small">
          <i class="fas fa-angle-down" aria-hidden="true" />
        </span>
      </button>

      <div class="dropdown-menu" role="menu">
        <div class="dropdown-content">
          <button
            class="dropdown-item"
            type="button"
            @click="onClickBlockType(schema.nodes.paragraph)"
            @mousedown.prevent
          >
            <span class="icon is-small">
              <i class="fa-solid fa-paragraph"></i>
            </span>

            <span> Paragraph </span>
          </button>

          <button
            class="dropdown-item"
            type="button"
            @click="onClickBlockType(schema.nodes.code_block)"
            @mousedown.prevent
          >
            <span class="icon is-small">
              <i class="fa-solid fa-code"></i>
            </span>

            <span> Code Block </span>
          </button>

          <hr class="dropdown-divider" />

          <button
            v-for="index in 6"
            :key="index"
            class="dropdown-item"
            type="button"
            @click="onClickBlockType(schema.nodes.heading, { level: index })"
            @mousedown.prevent
          >
            <span class="icon is-small">
              <i class="fa-solid fa-heading"></i>
            </span>

            <span>{{ index }}</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
@use 'bulma/sass/base';
@use 'bulma/sass/themes';
@use 'bulma/sass/elements/button';
@use 'bulma/sass/components/dropdown';
@use 'bulma/sass/form/index';
</style>
