<script setup lang="ts">
import { DirectoryMenu } from '../entities/directory';
import { ref, watchEffect } from 'vue';
import { useFolderEntity } from '../entities/directory/model';
import mime from 'mime';
import { isUndefined } from 'lodash-es';
import type { Path } from '../shared/lib/fileSystemApi';
import { WorkSpaceWidget } from '../widgets/WorkSpace';

const folderEntity = useFolderEntity();

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

/*
todo: добавить поддержку markdown Front Matter.
todo: добавить контекстное меню
*/
</script>

<template>
  <div class="app-grid p-2">
    <div class="app-grid__menu">
      <DirectoryMenu @click-item="onClickItem" />
    </div>

    <WorkSpaceWidget
      v-if="openedPath"
      class="app-grid__workspace"
      :path-file="openedPath"
    />
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
