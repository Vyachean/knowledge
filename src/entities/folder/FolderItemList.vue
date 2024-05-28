<script setup lang="ts">
import type { Path } from '../../shared/lib/fileSystemApi';
import { computed, defineProps, onBeforeUnmount, toRef, watch } from 'vue';
import { useFolderEntity } from './model';
import FolderItem from './FolderItem.vue';

const props = defineProps<{
  /**
   * Путь к папке
   */
  path: Path;
}>();

const folderEntity = useFolderEntity();

const folderItemList = computed(() => folderEntity.getList(propsPath.value));

const propsPath = toRef(() => props.path);

let stopWatchList: (() => void) | undefined;

watch(
  propsPath,
  async (path) => {
    stopWatchList?.();
    stopWatchList = await folderEntity.watchList(path);
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  stopWatchList?.();
});
</script>

<template>
  <ul class="accordion">
    <FolderItem
      v-for="folderItem in folderItemList"
      :key="folderItem.name"
      class="accordion-item"
      :path="[...path, folderItem.name]"
      :item-type="folderItem.type"
    >
      {{ folderItem.name }}
    </FolderItem>
  </ul>
</template>
