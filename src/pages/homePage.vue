<script setup lang="ts">
import { DirectoryMenu } from '../entities/directory';
import { ref, watchEffect } from 'vue';
import { useDirectoryEntity } from '../entities/directory/model';
import mime from 'mime';
import { isUndefined } from 'lodash-es';
import type { Path } from '../shared/lib/fileSystemApi';
import { WorkSpaceWidget } from '../widgets/WorkSpace';
import { CreateItemForm } from '../features/createItem';
import { ModalView } from '../shared/ui/modal';
import DeleteItemForm from '../features/deleteItem/DeleteItemForm.vue';

const folderEntity = useDirectoryEntity();

const openedPath = ref<Path>();

watchEffect(() => {
  if (openedPath.value) {
    void folderEntity.fetchItem(openedPath.value);
  }
});

const onClickItem = (path: Path) => {
  const name = path.at(-1);
  if (!isUndefined(name)) {
    const fileType = mime.getType(name);
    if (fileType?.includes('markdown')) {
      openedPath.value = path;
    }
  }
};

const pathForNewItem = ref<Path>();

const pathForDeleteItem = ref<Path>();

const onDelete = (path: Path) => {
  console.log(path);
  pathForDeleteItem.value = path;
};

/*
todo: добавить поддержку markdown Front Matter.
todo: добавить контекстное меню в редактор
*/
</script>

<template>
  <div class="app-grid p-2">
    <div class="app-grid__menu">
      <DirectoryMenu
        @click-item="onClickItem"
        @create="pathForNewItem = $event"
        @delete="onDelete"
      />
    </div>

    <WorkSpaceWidget
      v-if="openedPath"
      class="app-grid__workspace"
      :path-file="openedPath"
    />

    <ModalView
      v-if="pathForNewItem"
      show-close-btn
      @click-background="pathForNewItem = undefined"
      @click-close-btn="pathForNewItem = undefined"
      @key-esc="pathForNewItem = undefined"
    >
      <div class="card">
        <div class="card-content">
          <CreateItemForm
            :path="pathForNewItem"
            @cancel="pathForNewItem = undefined"
            @created="pathForNewItem = undefined"
          />
        </div>
      </div>
    </ModalView>

    <ModalView
      v-if="pathForDeleteItem"
      show-close-btn
      @click-background="pathForDeleteItem = undefined"
      @click-close-btn="pathForDeleteItem = undefined"
      @key-esc="pathForDeleteItem = undefined"
    >
      <div class="card">
        <div class="card-content">
          <DeleteItemForm
            :path="pathForDeleteItem"
            @cancel="pathForDeleteItem = undefined"
            @deleted="pathForDeleteItem = undefined"
          />
        </div>
      </div>
    </ModalView>
  </div>
</template>

<style lang="scss" scoped>
@use 'bulma/sass/base';
@use 'bulma/sass/themes';
@use 'bulma/sass/helpers/spacing';

.app-grid {
  display: grid;
  grid-template: 'menu workspace' / minmax(200px, min-content) auto;
  gap: 16px;

  &__menu {
    grid-area: menu;
  }
  &__workspace {
    grid-area: workspace;
  }
}
</style>
