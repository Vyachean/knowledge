<script setup lang="ts">
import { ref, toRefs } from 'vue';
import type { Path } from '../../shared/lib/fileSystemApi';
import type { ItemType } from './model';
import FolderItemList from './DirectoryItemList.vue';
import type { EmptyObject } from 'type-fest';

const props = defineProps<{
  path: Path;
  itemType: ItemType;
}>();

const { path, itemType } = toRefs(props);

defineSlots<{
  default: EmptyObject;
}>();

const openSubItems = ref(false);

const emits = defineEmits<{
  clickItem: [path: Path];
}>();

const onClickChangeSubItems = () => {
  emits('clickItem', path.value);

  if (itemType.value === 'folder') {
    openSubItems.value = !openSubItems.value;
  } else {
    openSubItems.value = false;
  }
};

const onClickItem = (path: Path) => {
  emits('clickItem', path);
};
</script>

<template>
  <li class="folder-item">
    <button
      type="button"
      class="accordion-button"
      :class="{ 'is-active': openSubItems }"
      @click="onClickChangeSubItems"
    >
      <slot />
    </button>

    <FolderItemList
      v-if="openSubItems"
      class="accordion-collapse"
      :path="path"
      @click-item="onClickItem"
    />
  </li>
</template>

<style lang="scss">
@use 'bulma/sass/base';
@use 'bulma/sass/themes';
@use 'bulma/sass/components/menu';
</style>
