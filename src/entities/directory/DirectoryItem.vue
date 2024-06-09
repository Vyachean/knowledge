<script setup lang="ts">
import { ref, toRefs } from 'vue';
import type { Path } from '../../shared/lib/fileSystemApi';
import type { ItemType } from './model';
import FolderItemList from './DirectoryItemList.vue';
import ContextMenu from './ContextMenu.vue';
import { vOnClickOutside } from '@vueuse/components';

const props = defineProps<{
  path: Path;
  itemType: ItemType;
}>();

const { path, itemType } = toRefs(props);

defineSlots<{
  default(): unknown;
}>();

const openSubItems = ref(false);

const emit = defineEmits<{
  clickItem: [path: Path];
  create: [path: Path];
  delete: [path: Path];
}>();

const onClickChangeSubItems = () => {
  emit('clickItem', path.value);

  if (itemType.value === 'folder') {
    openSubItems.value = !openSubItems.value;
  } else {
    openSubItems.value = false;
  }
};

const onClickItem = (path: Path) => {
  emit('clickItem', path);
};

const isActiveContextMenu = ref(false);
const onClickOutsideContextMenu = () => {
  isActiveContextMenu.value = false;
};

const onCreate = (path: Path) => {
  emit('create', path);
};

const onDelete = (path: Path) => {
  emit('delete', path);
};
</script>

<template>
  <li class="directory-item">
    <div class="directory-item__label label has-addons">
      <button
        type="button"
        class="label__open-btn"
        :class="{ 'is-active': openSubItems }"
        @click="onClickChangeSubItems"
      >
        <slot />
      </button>

      <button
        type="button"
        class="label__context-btn"
        @click="isActiveContextMenu = !isActiveContextMenu"
      >
        <div class="icon is-small">
          <i class="fa-solid fa-ellipsis-vertical" />
        </div>
      </button>

      <ContextMenu
        v-if="isActiveContextMenu"
        v-on-click-outside="onClickOutsideContextMenu"
        :path="path"
        @click="isActiveContextMenu = false"
        @create="onCreate"
        @delete="onDelete"
      />
    </div>

    <FolderItemList
      v-if="openSubItems"
      class="directory-item__label"
      :path="path"
      @click-item="onClickItem"
      @create="onCreate"
      @delete="onDelete"
    />
  </li>
</template>

<style lang="scss" scoped>
.directory-item {
  &__label {
    flex-wrap: nowrap;
  }
}
.label {
  display: flex;
  &__context-btn {
    width: min-content;
  }
}
</style>
