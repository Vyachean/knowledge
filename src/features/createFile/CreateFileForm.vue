<script setup lang="ts">
import { reactive, type PropType } from 'vue';
import type { Path } from '../../shared/lib/fileSystemApi';
import type { ValueOf } from 'type-fest';
import { useDirectoryEntity } from '../../entities/directory';
import { findKey, isUndefined } from 'lodash-es';

const props = defineProps({
  path: {
    type: Array as PropType<Path>,
    default: () => [],
  },
});

const Extensions = {
  md: 'text/markdown',
  txt: 'text/plain',
} as const;

const formState = reactive<{
  name: string | undefined;
  extension: ValueOf<typeof Extensions>;
}>({
  name: undefined,
  extension: Extensions.md,
});

const emit = defineEmits<{
  created: [];
  cancel: [];
}>();

const directoryEntity = useDirectoryEntity();

const onSubmit = async () => {
  if (!isUndefined(formState.name)) {
    const fileName = `${formState.name}.${findKey(Extensions, (v) => v === formState.extension) ?? ''}`;
    const pathNewFile = [...props.path, fileName];
    await directoryEntity.writeItem(
      pathNewFile,
      new File([], fileName, { type: formState.extension }),
    );
    emit('created');
  }
};

const onClickCancel = () => {
  emit('cancel');
};
</script>

<template>
  <form @submit.prevent="onSubmit">
    <div class="field has-addons">
      <p class="control">
        <input
          v-model="formState.name"
          class="input"
          type="text"
          placeholder="fileName"
        />
      </p>

      <p class="control">
        <span class="select">
          <select v-model="formState.extension">
            <option
              v-for="(extType, extName) in Extensions"
              :key="extName"
              :value="extType"
            >
              .{{ extName }}
            </option>
          </select>
        </span>
      </p>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button class="button is-primary" type="submit">Create</button>
      </div>

      <div class="control">
        <button class="button" type="button" @click="onClickCancel">
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>
