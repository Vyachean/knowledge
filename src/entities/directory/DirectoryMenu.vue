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
  create: [path: Path];
  delete: [path: Path];
}>();

const onClickItem = (path: Path) => {
  emit('clickItem', path);
};

const onCreate = (path: Path) => {
  emit('create', path);
};
</script>

<template>
  <div class="directoryMenu">
    <button
      type="button"
      class="button is-fullwidth"
      @click="onClickSelectDirectory"
    >
      <span class="icon is-small">
        <i class="fas fa-folder-open"></i>
      </span>

      <span>select root folder</span>
    </button>

    <div class="directoryMenu__menu menu">
      <FolderItemList
        v-if="selectedRootDirectory"
        :path="[]"
        @click-item="onClickItem"
        @create="onCreate"
        @delete="emit('delete', $event)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.directoryMenu {
  display: flex;
  flex-direction: column;
  &__menu {
    $margin: var(--bulma-menu-nested-list-margin);
    --bulma-menu-nested-list-margin: $margin 0 $margin $margin;
    overflow-y: auto;
    flex-grow: 1;
    flex-shrink: 1;
  }
}
</style>
