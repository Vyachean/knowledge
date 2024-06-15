<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3';
import { ref } from 'vue';
import { vOnClickOutside } from '@vueuse/components';

const props = defineProps<{
  editor: Editor;
}>();

type ToggleType =
  | 'Italic'
  | 'Bold'
  | 'Strike'
  | 'Code'
  | 'BulletList'
  | 'OrderedList'
  | 'CodeBlock'
  | 'Blockquote'
  | 'TaskList';
const canToggle = (toggleType: ToggleType) =>
  props.editor.can().chain().focus()[`toggle${toggleType}`]().run();

const runToggle = (toggleType: ToggleType) => {
  props.editor.chain().focus()[`toggle${toggleType}`]().run();
};

const headingLevels = [1, 2, 3, 4, 5, 6] as const;

type Level = 1 | 2 | 3 | 4 | 5 | 6;

const toggleHeading = (level: Level) => {
  return props.editor.chain().focus().toggleHeading({ level }).run();
};

const isActiveBlockTypeList = ref(false);

const onClickOutsideBlockType = () => {
  isActiveBlockTypeList.value = false;
};
</script>

<template>
  <section>
    <div class="field has-addons m-0">
      <div class="control">
        <button
          class="button"
          type="button"
          :disabled="!canToggle('Italic')"
          :class="{ 'is-active': editor.isActive('italic') }"
          @click="runToggle('Italic')"
          @mousedown.prevent
        >
          <span class="icon is-small"> <i class="fa-solid fa-italic" /> </span>
        </button>
      </div>

      <div class="control">
        <button
          class="button"
          type="button"
          :disabled="!canToggle('Bold')"
          :class="{ 'is-active': editor.isActive('bold') }"
          @click="runToggle('Bold')"
          @mousedown.prevent
        >
          <span class="icon is-small"> <i class="fa-solid fa-bold" /> </span>
        </button>
      </div>

      <div class="control">
        <button
          class="button"
          type="button"
          :disabled="!canToggle('Strike')"
          :class="{ 'is-active': editor.isActive('strike') }"
          @click="runToggle('Strike')"
          @mousedown.prevent
        >
          <span class="icon is-small">
            <i class="fa-solid fa-strikethrough"></i>
          </span>
        </button>
      </div>

      <div class="control">
        <button
          class="button"
          type="button"
          :disabled="!canToggle('Code')"
          :class="{ 'is-active': editor.isActive('code') }"
          @click="runToggle('Code')"
          @mousedown.prevent
        >
          <span class="icon is-small"> <i class="fa-solid fa-code"></i> </span>
        </button>
      </div>
    </div>

    <div class="field has-addons m-0">
      <div class="control">
        <button
          class="button"
          type="button"
          :disabled="!canToggle('BulletList')"
          :class="{ 'is-active': editor.isActive('bulletList') }"
          @click="runToggle('BulletList')"
          @mousedown.prevent
        >
          <span class="icon is-small">
            <i class="fa-solid fa-list-ul"></i>
          </span>
        </button>
      </div>

      <div class="control">
        <button
          class="button"
          type="button"
          :disabled="!canToggle('OrderedList')"
          :class="{ 'is-active': editor.isActive('orderedList') }"
          @click="runToggle('OrderedList')"
          @mousedown.prevent
        >
          <span class="icon is-small">
            <i class="fa-solid fa-list-ol"></i>
          </span>
        </button>
      </div>

      <div class="control">
        <button
          class="button"
          type="button"
          :disabled="!canToggle('TaskList')"
          :class="{ 'is-active': editor.isActive('taskList') }"
          @click="runToggle('TaskList')"
          @mousedown.prevent
        >
          <span class="icon is-small">
            <i class="fa-solid fa-list-check"></i>
          </span>
        </button>
      </div>

      <div class="control">
        <button
          class="button"
          type="button"
          :disabled="!canToggle('CodeBlock')"
          :class="{ 'is-active': editor.isActive('codeBlock') }"
          @click="runToggle('CodeBlock')"
          @mousedown.prevent
        >
          <span class="icon is-small"> <i class="fa-solid fa-code"></i> </span>
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
          <span>Heading</span>

          <span class="icon is-small">
            <i class="fas fa-angle-down" aria-hidden="true" />
          </span>
        </button>

        <div class="dropdown-menu" role="menu">
          <div class="dropdown-content">
            <button
              v-for="level in headingLevels"
              :key="level"
              class="dropdown-item"
              type="button"
              @click="toggleHeading(level)"
              @mousedown.prevent
            >
              <span class="icon is-small">
                <i class="fa-solid fa-heading"></i>
              </span>

              <span>{{ level }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="field has-addons m-0">
      <div class="control">
        <button
          class="button"
          type="button"
          @click="editor.chain().focus().setHorizontalRule().run()"
          @mousedown.prevent
        >
          <span class="icon is-small">
            <i class="fa-solid fa-minus"></i>
          </span>
        </button>
      </div>
    </div>

    <div class="field has-addons m-0">
      <div class="control">
        <button
          class="button"
          type="button"
          :disabled="!editor.can().chain().focus().undo().run()"
          @click="editor.chain().focus().undo().run()"
          @mousedown.prevent
        >
          <span class="icon is-small">
            <i class="fa-solid fa-rotate-left"></i>
          </span>
        </button>

        <button
          class="button"
          type="button"
          :disabled="!editor.can().chain().focus().redo().run()"
          @click="editor.chain().focus().redo().run()"
          @mousedown.prevent
        >
          <span class="icon is-small">
            <i class="fa-solid fa-rotate-right"></i>
          </span>
        </button>
      </div>
    </div>
  </section>
</template>
