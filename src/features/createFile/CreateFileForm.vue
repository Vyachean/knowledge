<script setup lang="ts">
import { reactive, ref, type PropType } from 'vue';
import type { Path } from '../../shared/lib/fileSystemApi';
import type { ValueOf } from 'type-fest';
import { useDirectoryEntity } from '../../entities/directory';
import { findKey, isUndefined } from 'lodash-es';
import { useNotification } from '../../shared/ui/notifications';

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

const isLoading = ref(0);

const notification = useNotification();

const onSubmit = async () => {
  if (!isLoading.value) {
    isLoading.value += 1;
    try {
      if (!isUndefined(formState.name)) {
        const fileName = `${formState.name}.${findKey(Extensions, (v) => v === formState.extension) ?? ''}`;
        const pathNewFile = [...props.path, fileName];
        const hasItem = !!(await directoryEntity.fetchItem(pathNewFile));
        if (!hasItem) {
          await directoryEntity.writeItem(
            pathNewFile,
            new File([], fileName, { type: formState.extension }),
          );
          emit('created');
        } else {
          notification.addDanger({
            title: 'Такой файл уже существует',
            content: `Файл с именем "${fileName}"" уже есть в папке "${props.path.join('/')}"`,
          });
        }
      } else {
        notification.addDanger({
          title: 'Не указано имя файла',
          content: `Для создания файла укажите его имя`,
        });
      }
    } finally {
      isLoading.value -= 1;
    }
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
        <button
          class="button is-primary"
          :class="{
            'is-loading': isLoading,
          }"
          type="submit"
        >
          Create
        </button>
      </div>

      <div class="control">
        <button class="button" type="button" @click="onClickCancel">
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>
