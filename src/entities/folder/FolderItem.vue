<script setup lang="ts">
import { ref, toRefs } from 'vue';
import type { Path } from '../../shared/lib/fileSystemApi';
import type { ItemType } from './model';
import FolderItemList from './FolderItemList.vue';
import type { EmptyObject } from 'type-fest';

const props = defineProps<{
  path: Path;
  itemType: ItemType;
}>();

const { path, itemType } = toRefs(props);

defineSlots<{
  default: EmptyObject;
}>();

// const itemName = computed(() => path.value.at(-1));

const openSubItems = ref(false);

const onClickChangeSubItems = () => {
  if (itemType.value === 'folder') {
    openSubItems.value = !openSubItems.value;
  } else {
    openSubItems.value = false;
  }
};
</script>

<template>
  <div class="folder-item">
    <button
      type="button"
      class="accordion-button"
      @click="onClickChangeSubItems"
    >
      <slot />
    </button>

    <FolderItemList
      v-if="openSubItems"
      class="accordion-collapse"
      :path="path"
    />
  </div>
</template>

<style lang="scss" scoped>
.folder-item {
  display: flex;
  flex-direction: column;
}
</style>
