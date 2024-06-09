<script setup lang="ts">
import type { State } from './model';
import { isString } from 'lodash-es';

defineProps<{
  content: string;
  state?: State;
}>();

defineSlots<{
  default(): unknown;
}>();

const emit = defineEmits<{
  clickClose: [];
}>();
</script>

<template>
  <div
    class="notification"
    :class="{
      [`is-${state}`]: isString(state),
    }"
  >
    <button class="delete" type="button" @click="emit('clickClose')" />

    <slot>
      {{ content }}
    </slot>
  </div>
</template>

<style lang="scss" scoped>
.message-header {
  &:last-child {
    border-end-end-radius: var(--bulma-message-header-radius);
    border-end-start-radius: var(--bulma-message-header-radius);
  }
}
</style>
