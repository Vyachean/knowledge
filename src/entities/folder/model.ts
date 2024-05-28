import { defineStore } from 'pinia';
import type { FolderApi, Path } from '../../shared/lib/fileSystemApi';
import { createFileSystemApi } from '../../shared/lib/fileSystemApi';
import { computed, reactive, shallowRef } from 'vue';
import type { KeyString } from '../../shared/lib/convertKey';
import { toKey } from '../../shared/lib/convertKey';
import { isEqual } from 'lodash-es';
import { createAsyncInterval } from '../../shared/lib/asyncInterval';

export type ItemType = 'file' | 'folder';

export type FolderItem = {
  name: string;
  type: ItemType;
};
export type FolderState = FolderItem[];

export const useFolderEntity = defineStore('folderEntity', () => {
  const rootFolder = shallowRef<FolderApi>();

  const stateFolder: Map<KeyString<Path>, FolderState> = reactive(new Map());

  /**
   * Выбрать директорию с файлами
   */
  const selectRootDirectory = async () => {
    rootFolder.value = (await createFileSystemApi('folder-entity')).folder;
  };

  /**
   * Чтение папки
   * @param path
   */
  const readFolder = async (path: string[]) => {
    const entity = await rootFolder.value?.readPath(path);
    const key = toKey(path);

    if (entity && 'find' in entity) {
      const folderMap = await entity.read();
      const folderState: FolderState = [];
      folderMap.forEach((api, name) => {
        folderState.push({
          name,
          type: 'find' in api ? 'folder' : 'file',
        });
      });
      if (!isEqual(folderState, stateFolder.get(key))) {
        stateFolder.set(key, folderState);
      }
    } else {
      stateFolder.delete(key);
    }
  };

  /**
   * Интервальное отслеживание состояния папки
   * @param path - путь к папке
   * @returns
   */
  const watchList = async (path: Path, intervalTimeout: number = 1e3) => {
    const stopInterval = await createAsyncInterval(
      () => readFolder(path),
      intervalTimeout,
    );
    return stopInterval;
  };

  /**
   * Получить содержимое папки
   * @param path - путь к папке
   */
  const getList = (path: Path) => stateFolder.get(toKey(path));

  const selectedRootDirectory = computed(() => !!rootFolder.value);

  return {
    selectRootDirectory,
    selectedRootDirectory,
    getList,
    watchList,
  };
});
