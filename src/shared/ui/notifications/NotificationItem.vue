<script setup lang="ts">
import type { State } from './model';
import { isString } from 'lodash-es';

defineProps<{
  title: string;
  content?: string;
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
  <article
    class="message"
    :class="{
      [`is-${state}`]: isString(state),
    }"
  >
    <div class="message-header">
      <span>{{ title }}</span>

      <button
        class="delete"
        aria-label="delete"
        type="button"
        @click="emit('clickClose')"
      />
    </div>

    <div v-if="'default' in $slots || isString(content)" class="message-body">
      <slot>
        {{ content }}
      </slot>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.message-header {
  &:last-child {
    border-end-end-radius: var(--bulma-message-header-radius);
    border-end-start-radius: var(--bulma-message-header-radius);
  }
}
</style>