<script setup lang="ts">
import NotificationItem from './NotificationItem.vue';
import { useNotificationSet } from './model';

const notificationSet = useNotificationSet();
</script>

<template>
  <TransitionGroup name="list" tag="div" class="notificationList is-gap-2 p-4">
    <NotificationItem
      v-for="[id, item] in notificationSet.set"
      :key="id"
      :title="item.title"
      :content="item.content"
      :state="item.state"
      class="notificationList__item"
      @click-close="notificationSet.remove(id)"
    />
  </TransitionGroup>
</template>

<style lang="scss" scoped>
.notificationList {
  display: flex;
  flex-wrap: wrap-reverse;
  flex-direction: column;
  align-items: flex-start;
  align-content: flex-start;
  max-height: 100vh;
  width: 100vw;
  pointer-events: none;
  &__item {
    pointer-events: initial;
  }
}

.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(50vh);
}
.list-leave-to {
  opacity: 0;
  transform: translateY(-50vh);
}
.list-leave-active {
  position: absolute;
}
</style>
