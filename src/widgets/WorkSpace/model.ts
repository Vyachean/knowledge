import type { Ref } from 'vue';
import { computed, ref, watch } from 'vue';
import type { Path } from '../../shared/lib/fileSystemApi';
import { cloneDeep, debounce, isEqual, isString, isUndefined } from 'lodash-es';
import type { ItemFile } from '../../entities/directory';
import { useDirectoryEntity } from '../../entities/directory';

const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (isString(reader.result)) {
        resolve(reader.result);
      } else {
        reject(new Error('File reading failed'));
      }
    };
    reader.onerror = () => {
      reject(new Error('File reading failed'));
    };
    reader.readAsText(file);
  });
};

type DataState = {
  text: string;
  lastModified: number;
  path: Path;
};

export const useWorkspaceScope = <T extends Ref<Path>>(pathFile: T) => {
  const isSaveLoading = ref(0);
  const dataState = ref<DataState>();
  const readFileState = ref<DataState>();
  const folderEntity = useDirectoryEntity();

  const saveFile = async (state: DataState | undefined = dataState.value) => {
    if (isUndefined(state)) {
      throw new Error('state to save is not defined');
    }
    const saveState = cloneDeep(state);
    try {
      isSaveLoading.value += 1;
      const name = saveState.path.at(-1);
      if (!isUndefined(name)) {
        const options = { type: 'text/markdown' };
        const blob = new Blob([saveState.text], options);
        const file = new File([blob], name, options);
        const newFileApi = await folderEntity.writeItem(saveState.path, file);

        // актуализация состояния сразу после записи файла
        const writtenFile = await newFileApi.read();

        const lastModifiedFile = writtenFile.lastModified;

        if (
          dataState.value &&
          saveState.text === dataState.value.text &&
          isEqual(saveState.path, dataState.value.path)
        ) {
          dataState.value.lastModified = lastModifiedFile;
        }
      }
    } finally {
      isSaveLoading.value -= 1;
    }
  };

  const autoSave = debounce(
    (state: DataState | undefined, oldState: DataState | undefined) => {
      if (
        state &&
        state.text !== oldState?.text &&
        isEqual(state.path, oldState?.path)
      ) {
        void saveFile(state);
      }
    },
    3e3,
  );
  watch(dataState, autoSave, { deep: true });

  const saveAfterClose = (
    state: DataState | undefined,
    oldState: DataState | undefined,
  ) => {
    if (!isEqual(state?.path, oldState?.path)) {
      if (oldState) {
        return saveFile(oldState);
      }
    }
  };
  watch(dataState, saveAfterClose);

  const isChanged = computed(
    () => dataState.value?.text !== readFileState.value?.text,
  );

  const itemFile = computed((): (ItemFile & { path: Path }) | undefined => {
    const item = folderEntity.getItem(pathFile.value);
    if (item?.type === 'file') {
      return { ...item, path: cloneDeep(pathFile.value) };
    }
    return undefined;
  });

  watch(
    itemFile,
    async (itemFile) => {
      const path = itemFile?.path;
      if (path) {
        const item = folderEntity.getItem(path);
        if (item?.type === 'file') {
          const file = item.file;
          readFileState.value = {
            text: await readFileAsText(file),
            lastModified: file.lastModified,
            path,
          };
        } else {
          readFileState.value = undefined;
        }
      }
    },
    { immediate: true },
  );

  watch(readFileState, (readFileState) => {
    if (readFileState) {
      if (isUndefined(dataState.value)) {
        dataState.value = cloneDeep(readFileState);
      } else if (
        !isEqual(readFileState.path, dataState.value.path) ||
        readFileState.lastModified > dataState.value.lastModified
      ) {
        dataState.value = cloneDeep(readFileState);
      }
    }
  });

  const text = computed({
    get: () => dataState.value?.text,
    set: (text?: string) => {
      dataState.value = isUndefined(text)
        ? undefined
        : {
            lastModified: Date.now(),
            path: pathFile.value,
            text,
          };
    },
  });

  return {
    saveFile,
    isSaveLoading,
    isChanged,
    text,
  };
};
