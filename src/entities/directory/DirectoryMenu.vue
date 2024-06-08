<script setup lang="ts">
import { computed } from 'vue';
import FolderItemList from './DirectoryItemList.vue';
import { useDirectoryEntity } from './model';
import type { Path } from '../../shared/lib/fileSystemApi';

const folderEntity = useDirectoryEntity();

const onClickSelectDirectory = async () => {
  await folderEntity.selectRootDirectory();
};

const selectedRootDirectory = computed(
  () => folderEntity.selectedRootDirectory,
);

const emit = defineEmits<{
  clickItem: [path: Path];
  newFile: [path: Path];
}>();

const onClickItem = (path: Path) => {
  emit('clickItem', path);
};

const onNewFile = (path: Path) => {
  emit('newFile', path);
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

    <div class="menu">
      <FolderItemList
        v-if="selectedRootDirectory"
        :path="[]"
        @click-item="onClickItem"
        @new-file="onNewFile"
      />
    </div>
  </div>
</template>
