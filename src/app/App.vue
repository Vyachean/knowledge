<script setup lang="ts">
import Home from '../pages/homePage.vue';
import { NotificationList } from '../shared/ui/notifications';
</script>

<template>
  <main class="main">
    <Home />

    <NotificationList class="main__notificationList" />
  </main>
</template>

<style lang="scss" scoped>
.main__notificationList {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1e5;
}
</style>
