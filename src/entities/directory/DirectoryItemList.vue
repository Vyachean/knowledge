<script setup lang="ts">
import type { Path } from '../../shared/lib/fileSystemApi';
import { computed, toRef, watch } from 'vue';
import { useDirectoryEntity } from './model';
import FolderItem from './DirectoryItem.vue';

const props = defineProps<{
  /**
   * Путь к папке
   */
  path: Path;
}>();

const folderEntity = useDirectoryEntity();

const item = computed(() => folderEntity.getItem(propsPath.value));

const folderItemList = computed(() => {
  if (item.value?.type === 'folder') {
    return item.value.list.map(({ name, type }) => ({
      name,
      type,
      path: [...props.path, name],
    }));
  }
  return undefined;
});

const propsPath = toRef(() => props.path);

watch(
  propsPath,
  async (path) => {
    await folderEntity.fetchItem(path);
  },
  { immediate: true },
);

const emit = defineEmits<{
  clickItem: [path: Path];
  newFile: [path: Path];
}>();

const onClickItem = (path: Path) => {
  emit('clickItem', path);
};

const onNewFile = (path: Path) => {
  console.log('onNewFile');
  emit('newFile', path);
};
</script>

<template>
  <ul class="menu-list">
    <FolderItem
      v-for="folderItem in folderItemList"
      :key="folderItem.name"
      :path="folderItem.path"
      :item-type="folderItem.type"
      @click-item="onClickItem"
      @new-file="onNewFile"
    >
      {{ folderItem.name }}
    </FolderItem>
  </ul>
</template>
