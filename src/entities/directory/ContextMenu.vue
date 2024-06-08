<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import type { Path } from '../../shared/lib/fileSystemApi';
import { useDirectoryEntity } from './model';

const props = defineProps<{
  path: Path;
}>();

const directoryEntity = useDirectoryEntity();

const item = computed(() => directoryEntity.getItem(props.path));
watchEffect(() => {
  void directoryEntity.fetchItem(props.path);
});

const itemType = computed(() => item.value?.type);

const emit = defineEmits<{
  newFile: [path: Path];
}>();

const onClickNewFile = () => {
  console.log('onClickNewFile');
  emit('newFile', props.path);
};
</script>

<template>
  <div class="context-menu dropdown is-active">
    <div class="dropdown-menu" role="menu">
      <div class="dropdown-content">
        <template v-if="itemType === 'folder'">
          <button
            type="button"
            class="context-menu__item dropdown-item"
            @click="onClickNewFile"
          >
            <span class="icon is-small"><i class="fa-solid fa-file" /></span>

            <span class="ml-1"> New File </span>
          </button>

          <!--
            <button type="button" class="context-menu__item dropdown-item">
            <span class="icon is-small"><i class="fa-solid fa-folder" /></span>

            <span class="ml-1"> New Folder </span>
            </button> 
          -->
        </template>

        <!--
          <button type="button" class="context-menu__item dropdown-item">
          <span class="icon is-small"><i class="fa-solid fa-pen"></i></span>

          <span class="ml-1"> Rename </span>
          </button> 
        -->

        <!--
          <button type="button" class="context-menu__item dropdown-item">
          <span class="icon is-small"><i class="fa-solid fa-trash"></i></span>

          <span class="ml-1"> Delete </span>
          </button> 
        -->
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.context-menu {
  --bulma-dropdown-menu-min-width: min-content;
  &__item {
    padding-inline: var(--bulma-menu-list-link-padding);
  }
}
</style>
