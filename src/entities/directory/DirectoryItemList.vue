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
  <ul class="menu-list">
    <FolderItem
      v-for="folderItem in folderItemList"
      :key="folderItem.name"
      :path="folderItem.path"
      :item-type="folderItem.type"
      @click-item="onClickItem"
      @create="onCreate"
      @delete="emit('delete', $event)"
    >
      {{ folderItem.name }}
    </FolderItem>

    <li>
      <button type="button" @click="onCreate(path)">
        <span class="icon is-small"><i class="fa-solid fa-plus" /></span>

        <span class="ml-1"> Create </span>
      </button>
    </li>
  </ul>
</template>
