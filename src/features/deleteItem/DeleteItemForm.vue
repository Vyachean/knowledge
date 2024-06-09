<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { useDirectoryEntity } from '../../entities/directory';
import type { Path } from '../../shared/lib/fileSystemApi';

const props = defineProps<{
  path: Path;
}>();

const emit = defineEmits<{
  deleted: [];
  cancel: [];
}>();

const directoryEntity = useDirectoryEntity();

const isLoading = ref(0);

const onSubmit = async () => {
  isLoading.value += 1;
  try {
    await directoryEntity.deleteItem(props.path);
    emit('deleted');
  } finally {
    isLoading.value -= 1;
  }
};

const pathString = computed(() => props.path.join('/'));

const refForAutofocus = ref<HTMLElement>();

watchEffect(() => {
  refForAutofocus.value?.focus();
});
</script>

<template>
  <form @submit="onSubmit">
    <div class="title">Delete "/{{ pathString }}"?</div>

    <p class="mt-2">This action cannot be reversed</p>

    <div class="field is-grouped mt-4">
      <div class="control">
        <button
          class="button is-danger"
          type="button"
          :class="{
            'is-loading': isLoading,
          }"
        >
          Delete
        </button>
      </div>

      <div class="control">
        <button
          ref="refForAutofocus"
          class="button"
          type="button"
          @click="emit('cancel')"
        >
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>
