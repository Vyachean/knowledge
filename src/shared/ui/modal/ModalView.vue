<script setup lang="ts">
import { useScrollLock } from '@vueuse/core';
import { onBeforeUnmount } from 'vue';

defineProps({
  showCloseBtn: { type: Boolean, default: false },
});
const emit = defineEmits<{
  clickCloseBtn: [];
  clickBackground: [];
  keyEsc: [];
}>();

defineSlots<{
  default(): unknown;
}>();

const isScrollLocked = useScrollLock(window);

isScrollLocked.value = true;

onBeforeUnmount(() => {
  isScrollLocked.value = false;
});
</script>

<template>
  <dialog class="modal is-active" open @keydown.esc="emit('keyEsc')">
    <div class="modal-background" @click="emit('clickBackground')" />

    <div class="modal-content">
      <slot />
    </div>

    <button
      v-if="showCloseBtn"
      class="modal-close is-large"
      type="button"
      aria-label="close"
      @click="emit('clickCloseBtn')"
    />
  </dialog>
</template>

<style lang="scss">
@use 'bulma/sass/components/modal';
</style>

<style lang="scss" scoped>
dialog {
  background: transparent;
  margin: 0;
  width: 100vw;
  height: 100vh;
}

.modal {
  --bulma-modal-content-width: fit-content;
}
</style>
