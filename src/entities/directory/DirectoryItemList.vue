<script setup lang="ts">
import type { Path } from '../../shared/lib/fileSystemApi';
import { computed, toRef, watch } from 'vue';
import { useFolderEntity } from './model';
import FolderItem from './DirectoryItem.vue';

const props = defineProps<{
  /**
   * Путь к папке
   */
  path: Path;
}>();

const folderEntity = useFolderEntity();

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

const emits = defineEmits<{
  clickItem: [path: Path];
}>();

const onClickItem = (path: Path) => {
  emits('clickItem', path);
};
</script>

<template>
  <div class="menu">
    <ul class="menu-list">
      <FolderItem
        v-for="folderItem in folderItemList"
        :key="folderItem.name"
        :path="folderItem.path"
        :item-type="folderItem.type"
        @click-item="onClickItem"
      >
        {{ folderItem.name }}
      </FolderItem>
    </ul>
  </div>
</template>

<style lang="scss">
@use 'bulma/sass/base';
@use 'bulma/sass/themes';
@use 'bulma/sass/components/menu';
</style>
