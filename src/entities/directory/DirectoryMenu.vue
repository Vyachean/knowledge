<script setup lang="ts">
import { computed } from 'vue';
import FolderItemList from './DirectoryItemList.vue';
import { useFolderEntity } from './model';
import type { Path } from '../../shared/lib/fileSystemApi';

const folderEntity = useFolderEntity();

const onClickSelectDirectory = async () => {
  await folderEntity.selectRootDirectory();
};

const selectedRootDirectory = computed(
  () => folderEntity.selectedRootDirectory,
);

const emits = defineEmits<{
  clickItem: [path: Path];
}>();

const onClickItem = (path: Path) => {
  emits('clickItem', path);
};
</script>

<template>
  <div class="work-folder">
    <button
      type="button"
      class="button is-fullwidth"
      @click="onClickSelectDirectory"
    >
      <span class="icon is-small">
        <i class="fas fa-folder-open"></i>
      </span>

      <span>select directory</span>
    </button>

    <FolderItemList
      v-if="selectedRootDirectory"
      :path="[]"
      @click-item="onClickItem"
    />
  </div>
</template>

<style lang="scss">
@use 'bulma/sass/base';
@use 'bulma/sass/themes';
@use 'bulma/sass/elements/button';
@use 'bulma/sass/elements/icon';
</style>
