<script setup lang="ts">
import { computed } from 'vue';
import FolderItemList from './FolderItemList.vue';
import { useFolderEntity } from './model';

const folderEntity = useFolderEntity();

const onClickSelectDirectory = async () => {
  await folderEntity.selectRootDirectory();
};

const selectedRootDirectory = computed(
  () => folderEntity.selectedRootDirectory,
);
</script>

<template>
  <div class="work-folder">
    <button type="button" @click="onClickSelectDirectory">
      select directory
    </button>

    <FolderItemList v-if="selectedRootDirectory" :path="[]" />
  </div>
</template>

<style lang="scss" scoped>
.work-folder {
  display: flex;
  flex-direction: column;
}
</style>
