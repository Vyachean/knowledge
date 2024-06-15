<script setup lang="ts">
import { toRef } from 'vue';
import { EditorView } from '../../shared/ui/editor';
import { isUndefined } from 'lodash-es';
import type { Path } from '../../shared/lib/fileSystemApi';
import { useWorkspaceScope } from './model';

const props = defineProps<{
  pathFile: Path;
}>();

const { saveFile, isChanged, isSaveLoading, text } = useWorkspaceScope(
  toRef(() => props.pathFile),
);

const onClickSaveFile = async () => {
  await saveFile();
};
</script>

<template>
  <div class="workspace">
    <div class="workspace__panel buttons has-addons">
      <button
        class="button"
        type="button"
        :disabled="!isChanged"
        :class="{
          'is-loading': isSaveLoading,
        }"
        @click="onClickSaveFile"
      >
        Save
      </button>
    </div>

    <EditorView
      v-if="!isUndefined(text)"
      v-model:markdown="text"
      class="workspace__editor-view mt-4"
    />
  </div>
</template>

<style lang="scss">
@use 'bulma/sass/base';
@use 'bulma/sass/themes';
@use 'bulma/sass/elements/button';
@use 'bulma/sass/helpers/spacing';
</style>

<style lang="scss" scoped>
.workspace {
  display: flex;
  flex-direction: column;
}
</style>
