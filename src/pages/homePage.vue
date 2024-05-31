<script setup lang="ts">
import { NavigationMenu } from '../widgets/NavigationMenu';
</script>

<template>
  <div class="app-grid p-2">
    <NavigationMenu class="app-grid__menu" />

    <div class="app-grid__workspace"></div>
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
