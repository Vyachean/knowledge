<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue';
import { EditorView } from '../../shared/ui/editor';
import { isString, isUndefined } from 'lodash-es';
import type { Path } from '../../shared/lib/fileSystemApi';
import { useDirectoryEntity } from '../../entities/directory';

const props = defineProps<{
  pathFile: Path;
}>();

const folderEntity = useDirectoryEntity();

const openedFile = computed((): File | undefined => {
  const path = props.pathFile;
  const item = folderEntity.getItem(path);
  if (item?.type === 'file') {
    return item.file;
  }
  return undefined;
});

const fileText = ref<string>();
const markdownText = ref<string>();

watchEffect(() => {
  if (!isUndefined(fileText.value)) {
    markdownText.value = fileText.value;
  }
});

const onClickSave = async () => {
  if (!isSaveLoading.value) {
    await saveFile();
  }
};

const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (isString(reader.result)) {
        resolve(reader.result);
      } else {
        reject(new Error('File reading failed'));
      }
    };
    reader.onerror = () => {
      reject(new Error('File reading failed'));
    };
    reader.readAsText(file);
  });
};

watch(openedFile, async (file) => {
  if (file) {
    fileText.value = await readFileAsText(file);
  } else {
    fileText.value = undefined;
  }
});

const isChanged = computed(() => markdownText.value !== fileText.value);

const isSaveLoading = ref(0);

const saveFile = async () => {
  try {
    isSaveLoading.value += 1;
    const content = markdownText.value;
    if (!isUndefined(content)) {
      const path = props.pathFile;
      const name = path.at(-1);
      if (!isUndefined(name)) {
        const options = { type: 'text/markdown' };
        const blob = new Blob([content], options);
        const file = new File([blob], name, options);
        await folderEntity.writeItem(path, file);
      }
    }
  } finally {
    isSaveLoading.value -= 1;
  }
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
        @click="onClickSave"
      >
        Save
      </button>
    </div>

    <EditorView
      v-if="!isUndefined(markdownText)"
      v-model:markdown="markdownText"
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
